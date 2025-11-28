import UnidadMedida from '../models/UnidadMedida.js';
import db from '../config/db.js';

export const obtenerUnidadesMedida = async (req, res) => {
    try {
        const unidades = await UnidadMedida.findAll({
            order: [["nombre", "ASC"]]
        });
        return res.json({ unidades })
    } catch (error) {
        console.error("Error al obtener unidades de medida:", error);
        return res.status(500).json({ msg: "Error al obtener unidades de medida" });
    }
}

export const obtenerUnidadMedida = async (req, res) => {
    try {
        const { id } = req.params;
        const unidad = await UnidadMedida.findByPk(id);
        if (!unidad) {
            return res.status(404).json({ msg: 'Unidad de medida no encontrada'});
        }
        return res.json({ unidad })
    } catch (error) {
        console.error("Error al obtener la unidad de medida:", error);
        return res.status(500).json({ msg: "Error al obtener la unidad de medida" });
    }
}

export const crearUnidadMedida = async (req, res) => {
    try {
        const usuario = req.usuario;
        if (!['superadmin'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: "No tienes permisos para realizar esta acción" });
        }

        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ msg: 'El nombre es requerido'})
        }

        const unidadExistente = await UnidadMedida.findOne({
            where: { nombre: nombre.trim()}
        });

        if (unidadExistente) {
            return res.status(400).json({ msg: 'Ya existe una unidad de medida con ese nombre'});
        }

        const nuevaUnidad = await UnidadMedida.create({
            nombre: nombre.trim()
        })

        return res.status(201).json({
            msg: 'Unidad de medida creada correctamente',
            unidad: nuevaUnidad
        })
    } catch (error) {
        console.error("Error al crear la unidad de medida:", error);
        return res.status(500).json({ msg: "Error al crear la unidad de medida" });
    }
}

export const actualizarUnidadMedida = async (req, res) => {
    try {
        const usuario = req.usuario;
        if (!['superadmin'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: "No tienes permisos para realizar esta acción" });
        }

        const { id } = req.params;
        const { nombre } = req.body;

        const unidad = await UnidadMedida.findByPk(id);
        if (!unidad) {
            return res.status(404).json({ msg: 'Unidad de medida no encontrada' });
        }

        if (!nombre) {
            return res.status(400).json({ msg: 'El nombre es requerido'})
        }

        const unidadExistente = await UnidadMedida.findOne({
            where: {
                nombre: nombre.trim(),
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        if(unidadExistente) {
            return res.status(400).json({ msg: 'Ya existe una unidad de medida con ese nombre'});
        }

        await unidad.update({
            nombre: nombre.trim()
        })

        return res.json({
            msg: 'Unidad de medida actualizada correctamente',
            unidad
        })
    } catch (error) {
        console.error("Error al actualizar la unidad de medida:", error);
        return res.status(500).json({ msg: "Error al actualizar la unidad de medida" });
    }
}

export const eliminarUnidadMedida = async (req, res) => {
    try {
        const usuario = req.usuario;
        if (!['superadmin'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: "No tienes permisos para realizar esta acción" });
        }
        const { id } = req.params;

        const unidad = await UnidadMedida.findByPk(id);
        if (!unidad) {
            return res.status(404).json({ msg: 'Unidad de medida no encontrada' });
        }
        await unidad.destroy();
        return res.json({ msg: 'Unidad de medida eliminada correctamente' });
    } catch (error) {
        console.error("Error al eliminar la unidad de medida:", error);
        return res.status(500).json({ msg: "Error al eliminar la unidad de medida" });
    }
}