import Producto from '../models/Producto.js';
import db from '../config/db.js'; // Agregar esta importación

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            order: [["nombre", "ASC"]]
        });
        return res.json({ productos });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ msg: 'Error en el servidor al obtener los productos' });
    }
}

export const obtenerProducto = async (req, res) => {
    try {
        const { id } = req.params;
        
        const producto = await Producto.findByPk(id);
        
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        
        return res.json({ producto });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ msg: 'Error en el servidor al obtener el producto' });
    }
}

export const crearProducto = async (req, res) => {
    try {
        const usuario = req.usuario;
        if (!['superadmin'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para crear productos' });
        }

        const { nombre, unidad } = req.body;

        if (!nombre || !unidad) {
            return res.status(400).json({ msg: 'Nombre y unidad son requeridos' });
        }

        // Verificar si ya existe un producto con el mismo nombre
        const productoExistente = await Producto.findOne({
            where: { nombre: nombre.trim() }
        });

        if (productoExistente) {
            return res.status(409).json({ msg: 'Ya existe un producto con ese nombre' });
        }

        const nuevoProducto = await Producto.create({
            nombre: nombre.trim(),
            unidad: unidad.trim()
        });

        return res.status(201).json({
            msg: 'Producto creado correctamente',
            producto: nuevoProducto
        });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ msg: 'Error en el servidor al crear el producto' });
    }
}

export const actualizarProducto = async (req, res) => {
    try {
        const usuario = req.usuario;
        if (!['superadmin'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para actualizar productos' });
        }

        const { id } = req.params;
        const { nombre, unidad } = req.body;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        if (!nombre || !unidad) {
            return res.status(400).json({ msg: 'Nombre y unidad son requeridos' });
        }

        // Verificar si ya existe otro producto con el mismo nombre
        const productoExistente = await Producto.findOne({
            where: { 
                nombre: nombre.trim(),
                id: { [db.Sequelize.Op.ne]: id } // CAMBIO: usar db.Sequelize.Op.ne en lugar de Producto.sequelize.Op.ne
            }
        });

        if (productoExistente) {
            return res.status(409).json({ msg: 'Ya existe otro producto con ese nombre' });
        }

        await producto.update({
            nombre: nombre.trim(),
            unidad: unidad.trim()
        });

        return res.json({
            msg: 'Producto actualizado correctamente',
            producto
        });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ msg: 'Error en el servidor al actualizar el producto' });
    }
}

export const eliminarProducto = async (req, res) => {
    try {
        const usuario = req.usuario;
        if (!['superadmin'].includes(usuario?.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar productos' });
        }

        const { id } = req.params;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        await producto.destroy();

        return res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ msg: 'Error en el servidor al eliminar el producto' });
    }
}