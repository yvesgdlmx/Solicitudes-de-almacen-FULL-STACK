import express from 'express';
import { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/productoController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, obtenerProductos);
router.get('/:id', checkAuth, obtenerProducto);
router.post('/', checkAuth, crearProducto);
router.put('/:id', checkAuth, actualizarProducto);
router.delete('/:id', checkAuth, eliminarProducto);

export default router;