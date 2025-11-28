import { DataTypes } from "sequelize";
import db from '../config/db.js'
import Usuario from "./Usuario.js";

const Solicitud = db.define('solicitudes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    folio: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    prioridad: {
        type: DataTypes.ENUM('muy alto', 'alto', 'moderado'),
        allowNull: false,
        defaultValue: 'moderado'
    },
    status: {
        type: DataTypes.ENUM(
            'pendiente surtido',
            'en proceso',
            'rechazada',
            'entrega parcial',
            'surtido'
        ),
        allowNull: false,
        defaultValue: 'pendiente surtido'
    },
    comentarioUser: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    comentarioAdmin: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    solicitante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    abierto: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false
});

export default Solicitud;