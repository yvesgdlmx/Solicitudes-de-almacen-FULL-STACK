import { Solicitud, Usuario, SeguimientoSurtido, EventoSurtido } from '../models/Index.js';
import db from '../config/db.js';
import { HORARIOS, ZONA, fechaLocal, ventanaSurtido } from '../helpers/horariosSurtido.js';
import { evaluarSolicitud, resumirSurtido } from '../helpers/metricasSurtido.js';
import { iniciarSeguimiento, MOTIVOS, esTerminal, errorOperacion } from '../services/seguimientoSurtido.js';

const fechaValida = valor => /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor;

export async function obtenerCumplimiento(req, res) {
    try {
        const { desde, hasta, responsable, prioridad, turno } = req.query;
        if ((desde && !fechaValida(desde)) || (hasta && !fechaValida(hasta)) || (desde && hasta && desde > hasta)) {
            return res.status(400).json({ msg: 'Periodo de fechas inválido' });
        }
        const ahora = new Date();
        const solicitudes = await Solicitud.findAll({ include: [{ model: SeguimientoSurtido, as: 'seguimiento', include: [{ model: Usuario, as: 'responsable', attributes: ['id', 'user'] }] }] });
        const filas = solicitudes.map(s => {
            const seguimiento = s.seguimiento;
            const ventana = seguimiento || ventanaSurtido(s.fechaHora);
            return {
                id: s.id, folio: s.folio, area: s.area, prioridad: s.prioridad, status: s.status,
                fechaHora: s.fechaHora, inicio: ventana.inicio, limite: ventana.limite, turno: ventana.turno,
                responsableId: seguimiento?.responsableId || null, responsable: seguimiento?.responsable?.user || 'Sin asignar',
                primeraAtencion: seguimiento?.primeraAtencion, completada: seguimiento?.completada,
                motivo: seguimiento?.motivo, detalle: seguimiento?.detalle,
                cumplimiento: evaluarSolicitud(s, seguimiento, ahora),
                minutosAtraso: seguimiento && evaluarSolicitud(s, seguimiento, ahora) !== 'sin seguimiento'
                    ? Math.max(0, Math.floor(((seguimiento.completada || ahora) - new Date(ventana.limite)) / 60000)) : null,
            };
        }).filter(f => (!desde || fechaLocal(f.limite) >= desde) && (!hasta || fechaLocal(f.limite) <= hasta)
            && (!responsable || String(f.responsableId || 'sin-asignar') === responsable)
            && (!prioridad || f.prioridad === prioridad) && (!turno || f.turno === turno));
        const orden = { 'muy alto': 0, alto: 1, moderado: 2 };
        filas.sort((a, b) => orden[a.prioridad] - orden[b.prioridad] || new Date(a.fechaHora) - new Date(b.fechaHora));
        const responsables = await Usuario.findAll({ where: { rol: ['admin', 'superadmin', 'desarrollo'] }, attributes: ['id', 'user'], order: [['user', 'ASC']] });
        const grupos = [...new Set(filas.map(f => f.responsableId))].map(id => {
            const propias = filas.filter(f => f.responsableId === id);
            return { id, nombre: propias[0].responsable, ...resumirSurtido(propias, ahora) };
        });
        const porPrioridad = ['muy alto', 'alto', 'moderado'].map(p => ({ prioridad: p, ...resumirSurtido(filas.filter(f => f.prioridad === p), ahora) }));
        const proxima = ventanaSurtido(ahora);
        const solicitudesProximoRango = filas.filter(f => new Date(f.inicio).getTime() === proxima.inicio.getTime() && !esTerminal(f.status)).length;
        res.json({ filas, metricas: resumirSurtido(filas, ahora), grupos, porPrioridad, responsables, motivos: MOTIVOS, horarios: HORARIOS, zona: ZONA, proxima, solicitudesProximoRango, actualizado: ahora });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'No se pudo consultar el cumplimiento' });
    }
}

export async function actualizarSeguimiento(req, res) {
    try {
        await db.transaction(async transaction => {
            const solicitud = await Solicitud.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
            if (!solicitud) throw errorOperacion('Solicitud no encontrada', 404);
            const { responsableId, motivo, detalle } = req.body;
            if (responsableId !== undefined && (!Number.isSafeInteger(responsableId) || responsableId <= 0)) throw errorOperacion('Responsable inválido', 400);
            if (motivo !== undefined && motivo !== null && !MOTIVOS.includes(motivo)) throw errorOperacion('Motivo inválido', 400);
            if (detalle !== undefined && (typeof detalle !== 'string' || detalle.length > 2000)) throw errorOperacion('El detalle admite hasta 2000 caracteres', 400);
            if (responsableId !== undefined) {
                if (esTerminal(solicitud.status)) throw errorOperacion('No se puede cambiar al responsable de una solicitud cerrada');
                const usuario = await Usuario.findByPk(responsableId, { transaction });
                if (!usuario || !['admin', 'superadmin', 'desarrollo'].includes(usuario.rol)) throw errorOperacion('Selecciona un responsable administrador válido', 400);
            }
            const seguimiento = await iniciarSeguimiento(solicitud, transaction);
            const anterior = { responsableId: seguimiento.responsableId, motivo: seguimiento.motivo, detalle: seguimiento.detalle };
            if (responsableId !== undefined) seguimiento.responsableId = responsableId;
            if (motivo !== undefined) seguimiento.motivo = motivo;
            if (detalle !== undefined) seguimiento.detalle = detalle.trim();
            await seguimiento.save({ transaction });
            await EventoSurtido.create({ SolicitudId: solicitud.id, actorId: req.usuario.id, responsableId: seguimiento.responsableId, tipo: 'asignación / incidencia', datos: { anterior, nuevo: { responsableId: seguimiento.responsableId, motivo: seguimiento.motivo, detalle: seguimiento.detalle } } }, { transaction });
        });
        res.json({ msg: 'Seguimiento actualizado' });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.status ? error.message : 'No se pudo guardar el seguimiento' });
    }
}

export async function obtenerHistorial(req, res) {
    try {
        const eventos = await EventoSurtido.findAll({ where: { SolicitudId: req.params.id }, include: [{ model: Usuario, as: 'actor', attributes: ['id', 'user'] }], order: [['createdAt', 'DESC'], ['id', 'DESC']] });
        res.json({ eventos });
    } catch {
        res.status(500).json({ msg: 'No se pudo consultar el historial' });
    }
}
