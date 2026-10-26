import { DataTypes } from 'sequelize';
import db from '../config/db.js';

// Tabla independiente: no modifica ni inventa datos de solicitudes históricas.
const SeguimientoSurtido = db.define('seguimientos_surtido', {
    SolicitudId: { type: DataTypes.INTEGER, primaryKey: true },
    responsableId: { type: DataTypes.INTEGER, allowNull: true },
    turno: { type: DataTypes.STRING, allowNull: false },
    inicio: { type: DataTypes.DATE, allowNull: false },
    limite: { type: DataTypes.DATE, allowNull: false },
    primeraAtencion: { type: DataTypes.DATE, allowNull: true },
    completada: { type: DataTypes.DATE, allowNull: true },
    motivo: { type: DataTypes.STRING, allowNull: true },
    detalle: { type: DataTypes.TEXT, allowNull: true },
}, { timestamps: true, freezeTableName: true });

export const EventoSurtido = db.define('eventos_surtido', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    SolicitudId: { type: DataTypes.INTEGER, allowNull: false },
    actorId: { type: DataTypes.INTEGER, allowNull: false },
    responsableId: { type: DataTypes.INTEGER, allowNull: true },
    tipo: { type: DataTypes.STRING, allowNull: false },
    datos: { type: DataTypes.JSON, allowNull: false },
}, { timestamps: true, updatedAt: false, freezeTableName: true });

export default SeguimientoSurtido;
