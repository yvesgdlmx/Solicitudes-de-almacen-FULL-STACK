import { Solicitud, SuministroParcial, Usuario, Suministro } from '../models/Index.js';
import db from '../config/db.js';

export const crearSuministroParcial = async (req, res) => {
    const t = await db.transaction();
    try {
        const usuario = req.usuario;
        if (!['admin', 'superadmin'].includes(usuario?.rol)) {
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

        const solicitud = await Solicitud.findByPk(solicitudId);
        if (!solicitud) {
            return res.status(404).json({ msg: 'Solicitud no encontrada' });
        }

        // Crear los suministros parciales
        for (const item of suministrosParciales) {
            const { cantidad, nombre, unidad } = item;
            await SuministroParcial.create({
                cantidad,
                nombre,
                unidad,
                SolicitudId: solicitud.id
            }, { transaction: t });
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
        await t.rollback();
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al registrar la entrega parcial' });
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
        if (!['admin', 'superadmin'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar entregas parciales' });
        }

        const { id } = req.params;

        const suministroParcial = await SuministroParcial.findByPk(id);
        if (!suministroParcial) {
            return res.status(404).json({ msg: 'Suministro parcial no encontrado' });
        }

        await suministroParcial.destroy();

        return res.json({ msg: 'Suministro parcial eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar suministro parcial:', error);
        res.status(500).json({ msg: 'Error en el servidor al eliminar el suministro parcial' });
    }
};