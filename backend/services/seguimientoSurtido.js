import SeguimientoSurtido, { EventoSurtido } from '../models/SeguimientoSurtido.js';
import { ventanaSurtido, validarEntrega } from '../helpers/horariosSurtido.js';

export const MOTIVOS = ['falta de existencias', 'espera del solicitante', 'problema del sistema', 'demora operativa'];
export const esTerminal = (status) => ['surtido', 'rechazada'].includes(status);
export function errorOperacion(msg, status = 409) {
    return Object.assign(new Error(msg), { status });
}

export async function iniciarSeguimiento(solicitud, transaction) {
    let seguimiento = await SeguimientoSurtido.findByPk(solicitud.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!seguimiento) {
        if (esTerminal(solicitud.status)) throw errorOperacion('Solicitud histórica cerrada: no tiene fechas verificables de seguimiento.');
        seguimiento = await SeguimientoSurtido.create({
            SolicitudId: solicitud.id, ...ventanaSurtido(solicitud.fechaHora),
        }, { transaction });
    }
    return seguimiento;
}

export async function registrarCambio(solicitud, status, actor, transaction, datos = {}) {
    const seguimiento = await iniciarSeguimiento(solicitud, transaction);
    const ahora = new Date();
    if (esTerminal(solicitud.status) && status !== solicitud.status) {
        throw errorOperacion('Una solicitud cerrada no puede reabrirse ni cambiar de resultado.');
    }
    let excepcionHorario = false;
    if (['surtido', 'entrega parcial'].includes(status) && (status !== solicitud.status || datos.entregas)) {
        excepcionHorario = validarEntrega(ahora, seguimiento.inicio, actor.rol);
    }
    if (!seguimiento.responsableId && !esTerminal(solicitud.status)) seguimiento.responsableId = actor.id;
    if (!seguimiento.primeraAtencion && status !== 'pendiente surtido') seguimiento.primeraAtencion = ahora;
    if (status === 'surtido' && !seguimiento.completada) seguimiento.completada = ahora;
    await seguimiento.save({ transaction });
    await EventoSurtido.create({
        SolicitudId: solicitud.id, actorId: actor.id, responsableId: seguimiento.responsableId,
        tipo: datos.entregas ? 'entrega parcial' : 'cambio de estado',
        datos: { anterior: solicitud.status, nuevo: status, ...datos, rolActor: actor.rol, excepcionHorario },
    }, { transaction });
    return seguimiento;
}
