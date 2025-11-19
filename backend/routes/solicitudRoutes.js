import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { actualizarSolicitud, cambiarStatusSolicitud, crearSolicitud, eliminarSolicitud, obtenerSolicitud, obtenerSolicitudes, obtenerSolicitudesPorUsuario } from '../controllers/solicitudController.js';

const router = express.Router();

router.post('/', checkAuth, crearSolicitud);
router.get('/', checkAuth, obtenerSolicitudes);
router.get('/usuario', checkAuth, obtenerSolicitudesPorUsuario);
router.get('/:id', checkAuth, obtenerSolicitud);
router.put('/:id', checkAuth, actualizarSolicitud)
router.put('/:id/status', checkAuth, cambiarStatusSolicitud)
router.delete('/:id', checkAuth, eliminarSolicitud)

export default router;