import { Solicitud, SuministroParcial, Usuario, Suministro, SeguimientoSurtido, EventoSurtido } from '../models/Index.js';
import db from '../config/db.js';
import { registrarCambio, errorOperacion, esTerminal } from '../services/seguimientoSurtido.js';

export const crearSuministroParcial = async (req, res) => {
    let t;
    try {
        const usuario = req.usuario;
        if (!['admin', 'superadmin', 'desarrollo'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para registrar entregas parciales' });
        }

        const { solicitudId } = req.params;
        let { suministrosParciales } = req.body;

        if (typeof suministrosParciales === 'string') {
            try {
                suministrosParciales = JSON.parse(suministrosParciales);
            } catch (error) {
                return res.status(400).json({ msg: 'Formato de suministros parciales inválido' });
            }
        }

        if (!suministrosParciales || !Array.isArray(suministrosParciales)) {
            return res.status(400).json({ msg: 'Suministros parciales inválidos' });
        }

        if (!suministrosParciales.length || suministrosParciales.some(item => !Number.isFinite(Number(item.cantidad)) || Number(item.cantidad) < 0 || !item.nombre || !item.unidad)) {
            return res.status(400).json({ msg: 'Incluye productos con cantidades válidas y no negativas' });
        }

        t = await db.transaction();
        const solicitud = await Solicitud.findByPk(solicitudId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!solicitud) {
            throw errorOperacion('Solicitud no encontrada', 404);
        }
        if (esTerminal(solicitud.status)) throw errorOperacion('No se pueden agregar entregas a una solicitud cerrada');
        await registrarCambio(solicitud, 'entrega parcial', usuario, t, { entregas: suministrosParciales });

        // Crear los suministros parciales (ahora permite cantidad 0)
        for (const item of suministrosParciales) {
            const { cantidad, nombre, unidad } = item;
            // Validar que cantidad sea >= 0 (antes era > 0)
            if (cantidad >= 0) {
                await SuministroParcial.create({
                    cantidad,
                    nombre,
                    unidad,
                    SolicitudId: solicitud.id
                }, { transaction: t });
            }
        }

        // Actualizar el status de la solicitud a "entrega parcial"
        await solicitud.update({ status: 'entrega parcial' }, { transaction: t });

        await t.commit();

        const solicitudActualizada = await Solicitud.findByPk(solicitud.id, {
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'user', 'area', 'rol'] },
                { model: Suministro, as: 'suministros' },
                { model: SuministroParcial, as: 'suministrosParciales' }
            ]
        });

        return res.status(201).json({
            msg: 'Entrega parcial registrada correctamente',
            solicitud: solicitudActualizada
        });
    } catch (error) {
        if (t && !t.finished) await t.rollback();
        console.error(error);
        res.status(error.status || 500).json({ msg: error.status ? error.message : 'Error en el servidor al registrar la entrega parcial' });
    }
};

export const obtenerSuministrosParciales = async (req, res) => {
    try {
        const { solicitudId } = req.params;

        const suministrosParciales = await SuministroParcial.findAll({
            where: { SolicitudId: solicitudId },
            order: [['fechaEntrega', 'DESC']]
        });

        return res.json({ suministrosParciales });
    } catch (error) {
        console.error("Error al obtener suministros parciales:", error);
        res.status(500).json({ msg: 'Error en el servidor al obtener los suministros parciales' });
    }
};

export const eliminarSuministroParcial = async (req, res) => {
    try {
        const usuario = req.usuario;
        if (!['admin', 'superadmin', 'desarrollo'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar entregas parciales' });
        }

        const { id } = req.params;

        const suministroParcial = await SuministroParcial.findByPk(id);
        if (!suministroParcial) {
            return res.status(404).json({ msg: 'Suministro parcial no encontrado' });
        }

        await db.transaction(async transaction => {
            const solicitud = await Solicitud.findByPk(suministroParcial.SolicitudId, { transaction, lock: transaction.LOCK.UPDATE });
            if (!solicitud || esTerminal(solicitud.status)) throw errorOperacion('No se pueden eliminar entregas de una solicitud cerrada');
            const seguimiento = await SeguimientoSurtido.findByPk(solicitud.id, { transaction });
            await EventoSurtido.create({
                SolicitudId: solicitud.id, actorId: usuario.id, responsableId: seguimiento?.responsableId,
                tipo: 'eliminación de entrega parcial', datos: { entregas: [{ nombre: suministroParcial.nombre, cantidad: suministroParcial.cantidad, unidad: suministroParcial.unidad }] },
            }, { transaction });
            await suministroParcial.destroy({ transaction });
        });

        return res.json({ msg: 'Suministro parcial eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar suministro parcial:', error);
        res.status(error.status || 500).json({ msg: error.status ? error.message : 'Error en el servidor al eliminar el suministro parcial' });
    }
};
