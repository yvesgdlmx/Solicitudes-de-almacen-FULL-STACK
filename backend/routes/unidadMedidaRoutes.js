import express from 'express';
import { obtenerUnidadesMedida, obtenerUnidadMedida, crearUnidadMedida, actualizarUnidadMedida, eliminarUnidadMedida } from '../controllers/unidadMedidaController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, obtenerUnidadesMedida);
router.get('/:id', checkAuth, obtenerUnidadMedida);
router.post('/', checkAuth, crearUnidadMedida);
router.put('/:id', checkAuth, actualizarUnidadMedida);
router.delete('/:id', checkAuth, eliminarUnidadMedida);

export default router;