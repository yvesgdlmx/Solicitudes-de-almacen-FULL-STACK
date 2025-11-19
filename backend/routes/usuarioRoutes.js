import express from 'express';
import { actualizarColorPerfil, autenticar, nuevoUsuario, obtenerUsuarioPorId, obtenerUsuarios, perfil, editarUsuario, eliminarUsuario } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/registro',checkAuth, nuevoUsuario);
router.post('/login', autenticar);
router.get('/perfil', checkAuth, perfil);
router.get('/usuarios', checkAuth, obtenerUsuarios);
router.get('/usuarios/id', checkAuth, obtenerUsuarioPorId);
router.put('/color-perfil', checkAuth, actualizarColorPerfil);
router.put('/editar.usuario', checkAuth, editarUsuario);
router.delete('/eliminar-usuario/:id', checkAuth, eliminarUsuario)

export default router;