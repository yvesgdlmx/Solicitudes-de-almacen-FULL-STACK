import { Solicitud, Usuario, Suministro } from '../models/Index.js';
import db from '../config/db.js';

export const obtenerDashboardUsuario = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        // 1. Estado de solicitudes
        const estadoSolicitudes = await Solicitud.findAll({
            where: { solicitante: usuarioId},
            attributes: [
                'status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'cantidad']
            ],
            group: ['status']
        });

        // 2. Solicitudes por mes (ultimos 6 meses)
        const solicitudesPorMes = await Solicitud.findAll({
            where: {
                solicitante: usuarioId,
                fechaHora: {
                    [db.Sequelize.Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6))
                }
            },
            attributes: [
                [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('fechaHora'), '%Y-%m'), 'mes'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'cantidad']
            ],
            group: [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('fechaHora'), '%Y-%m')],
            order: [[db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('fechaHora'), '%Y-%m'), 'ASC']]
        });

        // 3. Solicitudes por prioridad
        const solicitudesPorPrioridad = await Solicitud.findAll({
            where: { solicitante: usuarioId},
            attributes: [
                'prioridad',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'cantidad']
            ],
            group: ['prioridad']
        }); 

        // 4. suministros mas solicitados
        const productosMasSolicitados = await Suministro.findAll({
            include: [{
                model: Solicitud,
                as: 'solicitud',
                where: { solicitante: usuarioId },
                attributes: []
            }],
            attributes: [
                'nombre',
                [db.Sequelize.fn('SUM', db.Sequelize.col('cantidad')), 'totalSolicitado'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('suministros.id')), 'vecesSolicitado']
            ],
            group: ['nombre'],
            order: [[db.Sequelize.fn('SUM', db.Sequelize.col('cantidad')), 'DESC']],
            limit: 10
        });

        // 5. Métricas generales
        const totalSolicitudes = await Solicitud.count({
            where: { solicitante: usuarioId}
        });

        const solicitudesPendientes = await Solicitud.count({
            where: {
                solicitante: usuarioId,
                status: 'pendiente autorizacion'
            }
        });

        const solicitudesDelMes = await Solicitud.count({
            where: {
                solicitante: usuarioId,
                fechaHora: {
                    [db.Sequelize.Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });

        const solicitudesAprobadas = await Solicitud.count({
            where: {
                solicitante: usuarioId,
                status: ['autorizada', 'entrega parcial', 'surtido']
            }
        }); 

        const tasaAprobacion = totalSolicitudes > 0 ? Math.round((solicitudesAprobadas / totalSolicitudes) * 100) : 0;

        res.json({
            estadoSolicitudes,
            solicitudesPorMes,
            solicitudesPorPrioridad,
            productosMasSolicitados,
            metricas: {
                totalSolicitudes,
                solicitudesPendientes,
                solicitudesDelMes,
                tasaAprobacion
            }
        });
    } catch (error) {
        console.error('Error al obtener el dashboard del usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};