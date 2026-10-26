import { fechaLocal, HORARIOS, ventanaSurtido } from '../helpers/horariosSurtido.js';
import { evaluarSolicitud, resumirSurtido } from '../helpers/metricasSurtido.js';

export const MARCA = '[DEMO-CUMPLIMIENTO:v1]';
export const AREA = 'Laboratorio';
export const AREAS_SOLICITANTES = ['Surtido', 'AR', 'Mantenimiento', 'Administrativos'];
export const AREA_LEGADA = 'DEMO cumplimiento (datos sintéticos)';
export const CUENTAS_LEGADAS = ['DEMO_CUMP_V1_SOLICITANTE', 'DEMO_CUMP_V1_ALMACEN_A', 'DEMO_CUMP_V1_ALMACEN_B'];
export const CUENTAS = [
    { user: 'Sofía Ramírez', rol: 'user' },
    { user: 'Carlos Mendoza', rol: 'admin' },
    { user: 'Ana Torres', rol: 'admin' },
];
export const sumarMinutos = (fecha, minutos) => new Date(new Date(fecha).getTime() + minutos * 60000);

export function crearEscenarios(ahora = new Date()) {
    if (!Number.isFinite(ahora.getTime())) throw new Error('Fecha de simulación inválida');
    const dia = dias => {
        const fecha = new Date(`${fechaLocal(ahora)}T12:00:00-06:00`);
        fecha.setUTCDate(fecha.getUTCDate() + dias);
        return fechaLocal(fecha);
    };
    const filas = [];
    const agregar = (codigo, descripcion, inicio, status, opciones = {}) => {
        const fechaHora = opciones.actual ? ahora : sumarMinutos(inicio, -30);
        const ventana = ventanaSurtido(fechaHora);
        filas.push({
            folio: `ALM-${String(filas.length + 1).padStart(4, '0')}`, folioLegado: `DEMO-CUMP-V1-${codigo}`, descripcion, fechaHora, status,
            prioridad: ['muy alto', 'alto', 'moderado'][filas.length % 3],
            area: AREAS_SOLICITANTES[filas.length % AREAS_SOLICITANTES.length],
            ...ventana, responsable: filas.length % 2 === 0 ? 1 : 2,
            primeraAtencion: status === 'pendiente surtido' ? null : sumarMinutos(ventana.inicio, 2),
            completada: null, motivo: null, detalle: '', sinSeguimiento: false,
            ...opciones,
        });
    };
    // Dos días atrás garantiza que incluso los cierres tardíos nocturnos ya pasaron.
    HORARIOS.forEach(([, desde], i) => {
        const inicio = new Date(`${dia(-2)}T${desde}:00-06:00`);
        agregar(`TIEMPO-${i + 1}`, 'Entrega completa a tiempo', inicio, 'surtido', {
            completada: sumarMinutos(inicio, 15), reasignada: i === 2,
        });
    });
    for (const [hora, motivo] of [['07:00', 'falta de existencias'], ['15:00', 'demora operativa'], ['22:30', 'problema del sistema']]) {
        const inicio = new Date(`${dia(-2)}T${hora}:00-06:00`);
        const siguiente = ventanaSurtido(sumarMinutos(inicio, 31));
        agregar(`TARDE-${hora.replace(':', '')}`, 'Entrega completa en un rango posterior', inicio, 'surtido', {
            completada: sumarMinutos(siguiente.inicio, 10), motivo, detalle: `${MARCA} Incidencia simulada: ${motivo}.`,
        });
    }
    for (const [i, hora] of ['07:00', '15:00', '22:30'].entries()) {
        agregar(`VENCIDA-${i + 1}`, 'Solicitud pendiente con límite vencido', new Date(`${dia(-1)}T${hora}:00-06:00`),
            i === 0 ? 'pendiente surtido' : 'en proceso', {
                motivo: i === 1 ? 'demora operativa' : null,
                detalle: i === 1 ? `${MARCA} Pendiente por demora operativa simulada.` : '',
            });
    }
    agregar('PARCIAL', 'Entrega parcial que sigue vencida', new Date(`${dia(-1)}T12:00:00-06:00`), 'entrega parcial', {
        motivo: 'falta de existencias', detalle: `${MARCA} Se entregaron 4 de 10 guantes.`,
    });
    agregar('RECHAZADA', 'Rechazo excluido de la evaluación', new Date(`${dia(-1)}T17:30:00-06:00`), 'rechazada', {
        motivo: 'espera del solicitante', detalle: `${MARCA} Solicitud rechazada de demostración.`,
    });
    agregar('HISTORICA', 'Cierre antiguo sin seguimiento verificable', new Date(`${dia(-1)}T09:30:00-06:00`), 'surtido', {
        sinSeguimiento: true, responsable: null, primeraAtencion: null,
    });
    const proxima = ventanaSurtido(ahora);
    agregar('ACTUAL-PENDIENTE', 'Pendiente del rango actual o siguiente, sin asignar', proxima.inicio, 'pendiente surtido', {
        actual: true, responsable: null,
    });
    agregar('ACTUAL-PROCESO', 'Preparación del rango actual o siguiente', proxima.inicio, 'en proceso', {
        actual: true, primeraAtencion: ahora,
    });
    return filas;
}

export function resumenEscenarios(filas, ahora = new Date()) {
    return resumirSurtido(filas.map(f => ({ ...f,
        cumplimiento: evaluarSolicitud(f, f.sinSeguimiento ? null : f, ahora),
    })), ahora);
}
