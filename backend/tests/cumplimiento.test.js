import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HORARIOS, ventanaSurtido, validarEntrega, fechaLocal } from '../helpers/horariosSurtido.js';
import { evaluarSolicitud, resumirSurtido } from '../helpers/metricasSurtido.js';
import { ROLES, puedeGestionarUsuarios, puedeGestionarCuenta } from '../helpers/roles.js';

const dia = '2026-10-15';
const instante = hora => new Date(`${dia}T${hora}:00-06:00`);

test('fuera de horario asigna el siguiente rango permitido', () => {
    for (const [hora, esperada] of [['08:15', '09:30'], ['13:00', '15:00'], ['21:00', '22:30'], ['00:10', '01:00']]) {
        assert.equal(ventanaSurtido(instante(hora)).inicio.getTime(), instante(esperada).getTime());
    }
});

for (let i = 0; i < HORARIOS.length; i++) {
    const [turno, inicio, fin] = HORARIOS[i];
    test(`${turno} ${inicio}: inicio incluido, final excluido`, () => {
        const ventana = ventanaSurtido(instante(inicio));
        assert.equal(ventana.turno, turno);
        assert.equal(ventana.inicio.getTime(), instante(inicio).getTime());
        assert.equal(ventana.limite.getTime(), instante(fin).getTime());
        assert.doesNotThrow(() => validarEntrega(instante(inicio), ventana.inicio));
        assert.doesNotThrow(() => validarEntrega(new Date(instante(fin).getTime() - 1), ventana.inicio));
        assert.throws(() => validarEntrega(instante(fin), ventana.inicio), { status: 409 });
        assert.ok(ventanaSurtido(instante(fin)).inicio > instante(fin));
    });
}

test('solicitud al final del día se asigna al nocturno del día siguiente', () => {
    const ventana = ventanaSurtido(instante('23:10'));
    assert.equal(ventana.inicio.toISOString(), '2026-10-16T07:00:00.000Z');
    assert.equal(ventana.limite.toISOString(), '2026-10-16T07:30:00.000Z');
    assert.equal(fechaLocal(ventana.inicio), '2026-10-16');
});

test('cambios de mes y año no dependen de la zona horaria del servidor', () => {
    assert.equal(ventanaSurtido(new Date('2026-12-31T23:59:59-06:00')).inicio.toISOString(), '2027-01-01T07:00:00.000Z');
    assert.equal(ventanaSurtido(new Date('2026-10-31T23:59:59-06:00')).inicio.toISOString(), '2026-11-01T07:00:00.000Z');
});

test('sin corte: recepción a 07:29 conserva el rango actual', () => {
    assert.equal(ventanaSurtido(instante('07:29')).limite.getTime(), instante('07:30').getTime());
});

test('una entrega atrasada se permite en otro rango, conservando el límite original', () => {
    const ventana = ventanaSurtido(instante('06:00'));
    assert.doesNotThrow(() => validarEntrega(instante('09:35'), ventana.inicio));
    assert.throws(() => validarEntrega(instante('08:00'), ventana.inicio), { status: 409 });
    assert.throws(() => validarEntrega(instante('03:35'), ventana.inicio), { status: 409 });
});

test('datos históricos cerrados no se consideran evaluables', () => {
    assert.equal(evaluarSolicitud({ status: 'surtido' }, null), 'sin seguimiento');
    assert.equal(evaluarSolicitud({ status: 'surtido' }, { inicio: instante('07:00'), limite: instante('07:30') }), 'sin seguimiento');
});

test('una entrega parcial sigue vencida y solo el cierre completo cumple', () => {
    const seguimiento = { inicio: instante('07:00'), limite: instante('07:30') };
    assert.equal(evaluarSolicitud({ status: 'entrega parcial' }, seguimiento, instante('08:00')), 'vencida');
    assert.equal(evaluarSolicitud({ status: 'en proceso' }, seguimiento, instante('07:20')), 'en plazo');
    assert.equal(evaluarSolicitud({ status: 'en proceso' }, seguimiento, instante('07:30')), 'vencida');
    assert.equal(evaluarSolicitud({ status: 'surtido' }, { ...seguimiento, completada: instante('07:20') }), 'a tiempo');
    assert.equal(evaluarSolicitud({ status: 'surtido' }, { ...seguimiento, completada: instante('09:35') }), 'fuera de plazo');
    assert.equal(evaluarSolicitud({ status: 'surtido' }, { ...seguimiento, completada: instante('06:59') }), 'fuera de plazo');
});

test('denominador incluye pendientes vencidas, excluye futuras, rechazadas e históricas', () => {
    const filas = [
        { status: 'surtido', cumplimiento: 'a tiempo', limite: instante('07:30') },
        { status: 'entrega parcial', cumplimiento: 'vencida', limite: instante('07:30'), motivo: 'falta de existencias' },
        { status: 'en proceso', cumplimiento: 'vencida', limite: instante('07:30'), motivo: 'demora operativa' },
        { status: 'surtido', cumplimiento: 'fuera de plazo', limite: instante('07:30') },
        { status: 'pendiente surtido', cumplimiento: 'en plazo', limite: instante('10:00') },
        { status: 'rechazada', cumplimiento: 'rechazada', limite: instante('07:30') },
        { status: 'surtido', cumplimiento: 'sin seguimiento', limite: instante('07:30') },
    ];
    const metricas = resumirSurtido(filas, instante('08:00'));
    assert.equal(metricas.cumplimiento, 25);
    assert.equal(metricas.exigibles, 4);
    assert.equal(metricas.entregaCompleta, 40);
    assert.equal(metricas.vencidas, 2);
    assert.equal(metricas.atrasosOperativos, 1);
    assert.equal(metricas.atrasosSinClasificar, 1);
    assert.equal(metricas.sinSeguimiento, 1);
});

test('sin solicitudes evaluables muestra ausencia de datos, no un 0% engañoso', () => {
    assert.equal(resumirSurtido([]).cumplimiento, null);
    assert.equal(resumirSurtido([]).entregaCompleta, null);
});

test('solo desarrollo puede omitir el horario, incluso antes de la ventana asignada', () => {
    const inicio = instante('09:30');
    for (const rol of ['user', 'admin', 'superadmin', undefined, 'DESARROLLO', 'desconocido']) {
        assert.throws(() => validarEntrega(instante('08:00'), inicio, rol), { status: 409 });
        assert.throws(() => validarEntrega(instante('07:10'), inicio, rol), { status: 409 });
    }
    assert.equal(validarEntrega(instante('08:00'), inicio, 'desarrollo'), true);
    assert.equal(validarEntrega(instante('07:10'), inicio, 'desarrollo'), true);
});

test('desarrollo puede probar durante las 24 horas sin cambiar las ventanas de surtido', () => {
    for (let minuto = 0; minuto < 24 * 60; minuto += 15) {
        const ahora = new Date(instante('00:00').getTime() + minuto * 60000);
        const ventana = ventanaSurtido(ahora);
        assert.doesNotThrow(() => validarEntrega(ahora, ventana.inicio, 'desarrollo'));
        assert.deepEqual(ventanaSurtido(ahora), ventana);
        const fueraDeHorario = ahora < ventana.inicio;
        assert.equal(validarEntrega(ahora, ventana.inicio, 'desarrollo'), fueraDeHorario);
        if (fueraDeHorario) {
            assert.throws(() => validarEntrega(ahora, ventana.inicio, 'superadmin'), { status: 409 });
        } else {
            assert.equal(validarEntrega(ahora, ventana.inicio, 'superadmin'), false);
        }
    }
});

test('una prueba antes de su ventana conserva la evaluación con la hora real', () => {
    const ventana = ventanaSurtido(instante('08:00'));
    assert.equal(validarEntrega(instante('08:05'), ventana.inicio, 'desarrollo'), true);
    assert.equal(evaluarSolicitud({ status: 'surtido' }, { ...ventana, completada: instante('08:05') }), 'fuera de plazo');
});

test('desarrollo gestiona cuentas superiores, superadmin no modifica cuentas de desarrollo', () => {
    assert.ok(ROLES.includes('desarrollo'));
    assert.equal(puedeGestionarUsuarios('desarrollo'), true);
    assert.equal(puedeGestionarUsuarios('superadmin'), true);
    assert.equal(puedeGestionarUsuarios('admin'), false);
    assert.equal(puedeGestionarUsuarios('user'), false);
    assert.equal(puedeGestionarCuenta('superadmin', 'desarrollo'), false);
    assert.equal(puedeGestionarCuenta('desarrollo', 'desarrollo'), true);
    assert.equal(puedeGestionarCuenta('desarrollo', 'superadmin'), true);
    assert.equal(puedeGestionarCuenta('user', 'user'), false);
});
