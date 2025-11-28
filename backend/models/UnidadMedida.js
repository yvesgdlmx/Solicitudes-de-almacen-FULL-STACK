import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const UnidadMedida = db.define('unidades_medidas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true
    }
}, {
    timestamps: false
})

export default UnidadMedida;