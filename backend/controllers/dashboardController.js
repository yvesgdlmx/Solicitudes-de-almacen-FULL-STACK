import { Solicitud, Suministro } from "../models/Index.js";
import db from "../config/db.js";

export const obtenerDashboardUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const Op = db.Sequelize.Op;
    const ahora = new Date();
    const inicioMesActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);

    const calcularVariacion = (actual, anterior) => {
      if (anterior === 0 && actual === 0) return 0;
      if (anterior === 0) return 100;

      return Number((((actual - anterior) / anterior) * 100).toFixed(1));
    };

    const contarSolicitudes = (whereExtra = {}, desde = null, hasta = null) => {
      const where = {
        solicitante: usuarioId,
        ...whereExtra,
      };

      if (desde || hasta) {
        where.fechaHora = {};
        if (desde) where.fechaHora[Op.gte] = desde;
        if (hasta) where.fechaHora[Op.lt] = hasta;
      }

      return Solicitud.count({ where });
    };

    const estadoSolicitudes = await Solicitud.findAll({
      where: { solicitante: usuarioId },
      attributes: [
        "status",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "cantidad"],
      ],
      group: ["status"],
    });

    const solicitudesPorMes = await Solicitud.findAll({
      where: {
        solicitante: usuarioId,
        fechaHora: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
      attributes: [
        [db.Sequelize.fn("DATE_FORMAT", db.Sequelize.col("fechaHora"), "%Y-%m"), "mes"],
        [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "cantidad"],
      ],
      group: [db.Sequelize.fn("DATE_FORMAT", db.Sequelize.col("fechaHora"), "%Y-%m")],
      order: [[db.Sequelize.fn("DATE_FORMAT", db.Sequelize.col("fechaHora"), "%Y-%m"), "ASC"]],
    });

    const solicitudesPorPrioridad = await Solicitud.findAll({
      where: { solicitante: usuarioId },
      attributes: [
        "prioridad",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "cantidad"],
      ],
      group: ["prioridad"],
    });

    const productosMasSolicitados = await Suministro.findAll({
      include: [
        {
          model: Solicitud,
          as: "solicitud",
          where: { solicitante: usuarioId },
          attributes: [],
        },
      ],
      attributes: [
        "nombre",
        [db.Sequelize.fn("SUM", db.Sequelize.col("cantidad")), "totalSolicitado"],
        [db.Sequelize.fn("COUNT", db.Sequelize.col("suministros.id")), "vecesSolicitado"],
      ],
      group: ["nombre"],
      order: [[db.Sequelize.fn("SUM", db.Sequelize.col("cantidad")), "DESC"]],
      limit: 10,
    });

    const ultimasSolicitudes = await Solicitud.findAll({
      where: { solicitante: usuarioId },
      attributes: ["id", "folio", "area", "fechaHora", "prioridad", "status"],
      order: [["fechaHora", "DESC"]],
      limit: 6,
    });

    const totalSolicitudes = await contarSolicitudes();

    const solicitudesPendientes = await contarSolicitudes({ status: "pendiente surtido" });

    const solicitudesEnProceso = await contarSolicitudes({ status: "en proceso" });

    const solicitudesEntregaParcial = await contarSolicitudes({ status: "entrega parcial" });

    const solicitudesSurtidas = await contarSolicitudes({ status: "surtido" });

    const solicitudesRechazadas = await contarSolicitudes({ status: "rechazada" });

    const solicitudesDelMes = await contarSolicitudes({}, inicioMesActual);

    const solicitudesPrioridadAlta = await Solicitud.count({
      where: {
        solicitante: usuarioId,
        prioridad: {
          [Op.in]: ["alto", "muy alto"],
        },
      },
    });

    const solicitudesActivas =
      solicitudesPendientes + solicitudesEnProceso + solicitudesEntregaParcial;
    const tasaAprobacion =
      totalSolicitudes > 0 ? Math.round((solicitudesSurtidas / totalSolicitudes) * 100) : 0;
    const tasaRechazo =
      totalSolicitudes > 0 ? Math.round((solicitudesRechazadas / totalSolicitudes) * 100) : 0;
    const productoTop = productosMasSolicitados.length > 0 ? productosMasSolicitados[0] : null;
    const totalSolicitudesAnterior = await contarSolicitudes({}, null, inicioMesActual);
    const solicitudesMesAnterior = await contarSolicitudes({}, inicioMesAnterior, inicioMesActual);
    const activasMesActual = await contarSolicitudes(
      { status: { [Op.in]: ["pendiente surtido", "en proceso", "entrega parcial"] } },
      inicioMesActual
    );
    const activasMesAnterior = await contarSolicitudes(
      { status: { [Op.in]: ["pendiente surtido", "en proceso", "entrega parcial"] } },
      inicioMesAnterior,
      inicioMesActual
    );
    const surtidasAnterior = await contarSolicitudes({ status: "surtido" }, null, inicioMesActual);
    const tasaAprobacionAnterior =
      totalSolicitudesAnterior > 0
        ? Math.round((surtidasAnterior / totalSolicitudesAnterior) * 100)
        : 0;

    res.json({
      estadoSolicitudes,
      solicitudesPorMes,
      solicitudesPorPrioridad,
      productosMasSolicitados,
      ultimasSolicitudes,
      metricas: {
        totalSolicitudes,
        solicitudesPendientes,
        solicitudesEnProceso,
        solicitudesEntregaParcial,
        solicitudesSurtidas,
        solicitudesRechazadas,
        solicitudesActivas,
        solicitudesDelMes,
        solicitudesPrioridadAlta,
        tasaAprobacion,
        tasaRechazo,
        productoTop,
        comparativos: {
          totalSolicitudes: {
            actual: totalSolicitudes,
            anterior: totalSolicitudesAnterior,
            porcentaje: calcularVariacion(totalSolicitudes, totalSolicitudesAnterior),
          },
          solicitudesDelMes: {
            actual: solicitudesDelMes,
            anterior: solicitudesMesAnterior,
            porcentaje: calcularVariacion(solicitudesDelMes, solicitudesMesAnterior),
          },
          solicitudesActivas: {
            actual: activasMesActual,
            anterior: activasMesAnterior,
            porcentaje: calcularVariacion(activasMesActual, activasMesAnterior),
          },
          solicitudesSurtidas: {
            actual: solicitudesSurtidas,
            anterior: surtidasAnterior,
            porcentaje: calcularVariacion(solicitudesSurtidas, surtidasAnterior),
          },
          tasaAprobacion: {
            actual: tasaAprobacion,
            anterior: tasaAprobacionAnterior,
            porcentaje: Number((tasaAprobacion - tasaAprobacionAnterior).toFixed(1)),
            tipo: "puntos",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener el dashboard del usuario:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
