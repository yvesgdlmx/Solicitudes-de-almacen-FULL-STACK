import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearEscenarios, resumenEscenarios, MARCA, AREAS_SOLICITANTES } from '../scripts/demo-cumplimiento-datos.mjs';
import { HORARIOS, ventanaSurtido, validarEntrega } from '../helpers/horariosSurtido.js';
import { evaluarSolicitud } from '../helpers/metricasSurtido.js';

for (const fecha of ['2026-10-16T00:01:00-06:00', '2026-10-16T07:29:00-06:00', '2026-11-01T15:10:00-06:00', '2027-01-01T23:59:00-06:00']) {
    test(`demo coherente y resultados esperados a ${fecha}`, () => {
        const ahora = new Date(fecha);
        const filas = crearEscenarios(ahora);
        assert.equal(filas.length, 20);
        assert.equal(new Set(filas.map(f => f.folio)).size, 20);
        assert.equal(new Set(filas.map(f => f.prioridad)).size, 3);
        assert.equal(new Set(filas.map(f => f.turno)).size, 3);
        for (const area of AREAS_SOLICITANTES) assert.equal(filas.filter(f => f.area === area).length, 5);
        for (const f of filas) {
            assert.match(f.folio, /^ALM-\d{4}$/);
            assert.ok(f.folioLegado.startsWith('DEMO-CUMP-V1-'));
            assert.ok(f.fechaHora <= ahora);
            const ventana = ventanaSurtido(f.fechaHora);
            assert.equal(f.inicio.getTime(), ventana.inicio.getTime());
            assert.equal(f.limite.getTime(), ventana.limite.getTime());
            if (f.primeraAtencion) assert.ok(f.primeraAtencion >= f.fechaHora && f.primeraAtencion <= ahora);
            if (f.completada) {
                assert.ok(f.completada >= f.primeraAtencion && f.completada <= ahora);
                assert.doesNotThrow(() => validarEntrega(f.completada, f.inicio, 'admin'));
            }
        }
        const puntuales = filas.filter(f => evaluarSolicitud(f, f.sinSeguimiento ? null : f, ahora) === 'a tiempo');
        assert.equal(puntuales.length, 9);
        for (const [, inicio] of HORARIOS) assert.ok(puntuales.some(f => f.inicio.toISOString().slice(11, 16) === new Date(`2026-01-01T${inicio}:00-06:00`).toISOString().slice(11, 16)));
        const resumen = resumenEscenarios(filas, ahora);
        assert.equal(resumen.cumplimiento, 56);
        assert.equal(resumen.entregaCompleta, 67);
        assert.equal(resumen.vencidas, 4);
        assert.equal(resumen.fueraDePlazo, 3);
        assert.equal(resumen.sinSeguimiento, 1);
        assert.equal(resumen.rechazadas, 1);
        assert.equal(resumen.exigibles, 16);
        assert.equal(resumen.parciales, 1);
    });
}

test('folios estables permiten reconocer el lote aunque cambie el día de limpieza', () => {
    assert.deepEqual(crearEscenarios(new Date('2026-10-16T08:00:00-06:00')).map(f => f.folio),
        crearEscenarios(new Date('2027-01-01T08:00:00-06:00')).map(f => f.folio));
    assert.equal(MARCA, '[DEMO-CUMPLIMIENTO:v1]');
});

test('importar el ejecutable no conecta ni carga datos', async () => {
    const { main } = await import('../scripts/demo-cumplimiento.mjs');
    await assert.rejects(main(['acción-inválida']), /Uso:/);
    await assert.rejects(main(['crear', '--extra']), /Uso:/);
});
