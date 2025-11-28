import { DataTypes } from "sequelize";
import db from '../config/db.js'

const SuministroParcial = db.define('suministros_parciales', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unidad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SolicitudId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: 'solicitudes',
            key: 'id'
        }
    },
    fechaEntrega: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

export default SuministroParcial;