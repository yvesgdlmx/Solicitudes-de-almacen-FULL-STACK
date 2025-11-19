import {Solicitud, Usuario, Suministro} from '../models/Index.js';
import path from 'path';
import db from '../config/db.js';

const generarFolio = async (area) => {
    const letraArea = area.charAt(0).toUpperCase();
    const anioActual = new Date().getFullYear().toString().slice(-2);
    
    // Buscar el último folio del área y año actual
    const ultimoFolio = await Solicitud.findOne({
        where: {
            folio: {
                [db.Sequelize.Op.like]: `${letraArea}${anioActual}%`
            }
        },
        order: [['folio', 'DESC']]
    });
    
    let consecutivo = 1;
    if (ultimoFolio) {
        // Extraer el número consecutivo del último folio
        const numeroConsecutivo = parseInt(ultimoFolio.folio.slice(3)); // L25XXXXX -> XXXXX
        consecutivo = numeroConsecutivo + 1;
    }
    
    const bloqueDerecha = consecutivo.toString().padStart(5, "0");
    return `${letraArea}${anioActual}${bloqueDerecha}`;
}

export const crearSolicitud = async (req, res) => {
    const t = await db.transaction(); 
    try {
        const usuario = req.usuario; 
        if(!usuario) {
            return res.status(401).json({ msg: 'no autorizado'})
        }
        let { prioridad, comentarioUser, suministros } = req.body;

        if(typeof suministros === 'string') {
            try {
                suministros = JSON.parse(suministros);
            } catch (error) {
                return res.status(400).json({msg: 'Formato de suministros inválido'});
            }
        }
        if(!suministros || !Array.isArray(suministros)) {
            return res.status(400).json({msg: 'Suministros inválidos'});
        }
        
        const folio = await generarFolio(usuario.area);
        
        const nuevaSolicitud = await Solicitud.create({
            folio, 
            solicitante: usuario.id,
            prioridad,
            area: usuario.area,
            comentarioUser
        }, { transaction: t });
        
        for (const item of suministros) {
            const { cantidad, nombre, unidad } = item;
            await Suministro.create({
                cantidad,
                nombre,
                unidad,
                SolicitudId: nuevaSolicitud.id
            }, { transaction: t });
        }
        
        await t.commit();
        const solicitudconSuministros = await Solicitud.findByPk(nuevaSolicitud.id, {
            include: [
                {model: Usuario, as: 'usuario', attributes: ['id', 'user', 'area', 'rol']},
                {model: Suministro, as: 'suministros'}
            ]
        })
        return res.status(201).json({
            msg: 'Solicitud creada correctamente',
            solicitud: solicitudconSuministros
        })
    } catch (error) {
        await t.rollback();
        console.log(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({msg: 'Error al generar folio único. Intente nuevamente.'});
        }
        res.status(500).json({msg: 'Error en el servidor al crear la solicitud'});
    }
}

export const obtenerSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.findAll({
            order: [["fechaHora", "DESC"]],
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ['id', 'user', 'area', 'rol']
                },
                {
                    model: Suministro,
                    as: "suministros"
                }
            ]
        })
        return res.json({solicitudes});
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        res.status(500).json({msg: 'Error en el servidor al obtener las solicitudes'});
    }
}

export const obtenerSolicitudesPorUsuario = async (req, res) => {
    try {
        const usuario = req.usuario;
        if(!usuario) {
            return res.status(401).json({ msg: 'no autorizado'})
        }
        const solicitudes = await Solicitud.findAll({
            where: { solicitante: usuario.id },
            order: [["fechaHora", "DESC"]],
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ['id', 'user', 'area', 'rol']
                },
                {
                    model: Suministro,
                    as: "suministros"
                }
            ]
        });
        return res.json({ solicitudes})
    } catch (error) {
        console.error("Error al obtener solicitudes del usuario:", error);
        res.status(500).json({msg: 'Error en el servidor al obtener las solicitudes del usuario'});
    }
}

export const obtenerSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.usuario;

        const include = [
            { model: Usuario, as: "usuario", attributes: ['id', 'user', 'area', 'rol'] },
            { model: Suministro, as: "suministros" }
        ];

        let solicitud;
        if (['admin', 'superadmin'].includes(usuario?.rol)) {
            solicitud = await Solicitud.findByPk(id, { include });
        } else {
            solicitud = await Solicitud.findOne({
                where: { id, solicitante: usuario.id },
                include
            });
        }

        if (!solicitud) {
            return res.status(404).json({ msg: 'Solicitud no encontrada' });
        }
        return res.json({ solicitud });
    } catch (error) {
        console.error("Error al obtener la solicitud:", error);
        res.status(500).json({ msg: 'Error en el servidor al obtener la solicitud' });
    }
}

export const actualizarSolicitud = async (req, res) => {
    const t = await db.transaction();
    try {
        const usuario = req.usuario;
        if (!usuario) return res.status(401).json({ msg: 'no autorizado' });

        const { id } = req.params;
        let { prioridad, comentarioUser, suministros } = req.body;

        // Parseo opcional de suministros si viene como string
        if (typeof suministros === 'string') {
            try { suministros = JSON.parse(suministros); }
            catch { await t.rollback(); return res.status(400).json({ msg: 'Formato de suministros inválido' }); }
        }
        if (suministros !== undefined && !Array.isArray(suministros)) {
            await t.rollback();
            return res.status(400).json({ msg: 'Suministros inválidos' });
        }

        // Solo el creador puede editar
        const solicitud = await Solicitud.findOne({
            where: { id, solicitante: usuario.id },
            transaction: t
        });
        if (!solicitud) {
            await t.rollback();
            return res.status(404).json({ msg: 'Solicitud no encontrada' });
        }

        // Actualizar campos simples
        const updates = {};
        if (prioridad !== undefined) updates.prioridad = prioridad;
        if (comentarioUser !== undefined) updates.comentarioUser = comentarioUser;
        if (Object.keys(updates).length) {
            await solicitud.update(updates, { transaction: t });
        }

        // Reemplazar suministros si vienen en el payload
        if (Array.isArray(suministros)) {
            await Suministro.destroy({ where: { SolicitudId: solicitud.id }, transaction: t });
            for (const item of suministros) {
                const { cantidad, nombre, unidad } = item;
                await Suministro.create(
                    { cantidad, nombre, unidad, SolicitudId: solicitud.id },
                    { transaction: t }
                );
            }
        }

        await t.commit();

        const include = [
            { model: Usuario, as: "usuario", attributes: ['id', 'user', 'area', 'rol'] },
            { model: Suministro, as: "suministros" }
        ];
        const solicitudActualizada = await Solicitud.findByPk(id, { include });
        return res.json({ msg: 'Solicitud actualizada', solicitud: solicitudActualizada });
    } catch (error) {
        await t.rollback();
        console.error('Error al actualizar la solicitud:', error);
        return res.status(500).json({ msg: 'Error en el servidor al actualizar la solicitud' });
    }
}

export const eliminarSolicitud = async (req, res) => {
    const t = await db.transaction();
    try {
        const usuario = req.usuario;
        if (!usuario) return res.status(401).json({ msg: 'no autorizado' });

        const { id } = req.params;

        // Solo el creador puede eliminar
        const solicitud = await Solicitud.findOne({
            where: { id, solicitante: usuario.id },
            transaction: t
        });
        if (!solicitud) {
            await t.rollback();
            return res.status(404).json({ msg: 'Solicitud no encontrada' });
        }

        await Suministro.destroy({ where: { SolicitudId: solicitud.id }, transaction: t });
        await solicitud.destroy({ transaction: t });

        await t.commit();
        return res.json({ msg: 'Solicitud eliminada' });
    } catch (error) {
        await t.rollback();
        console.error('Error al eliminar la solicitud:', error);
        return res.status(500).json({ msg: 'Error en el servidor al eliminar la solicitud' });
    }
}

export const cambiarStatusSolicitud = async (req, res) => {
    try {
        const usuario = req.usuario;
        if(!['admin', 'superadmin'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para cambiar el status de las solicitudes'})
        }

        const { id } = req.params;
        const { status, comentarioAdmin } = req.body;

        const statusValidos = ['pendiente autorizacion', 'autorizada', 'rechazada', 'entrega parcial', 'surtido'];
        if(!statusValidos.includes(status)){
            return res.status(400).json({ msg: 'Status invalido'})
        }

        const solicitud = await Solicitud.findByPk(id);
        if(!solicitud) {
            return res.status(404).json({ msg: 'Solicitud no encontrada'})
        }

        solicitud.status = status
        if(comentarioAdmin !== undefined) {
            solicitud.comentarioAdmin = comentarioAdmin;
        }
        
        await solicitud.save();

        const solicitudActualizada = await Solicitud.findByPk(id, {
            include: [
                {model: Usuario, as: 'usuario', attributes: ['id', 'user', 'area', 'rol']},
                {model: Suministro, as: 'suministros'}
            ]
        });

        res.json({
            msg: 'Status de la solicitud actualizado',
            solicitud: solicitudActualizada
        })
    } catch (error) {
        console.error('Error al cambiar el status de la solicitud:', error);
        res.status(500).json({ msg: 'Error en el servidor al cambiar el status de la solicitud' });
    }
}