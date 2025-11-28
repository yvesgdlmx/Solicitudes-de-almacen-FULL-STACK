import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { 
    crearSuministroParcial, 
    obtenerSuministrosParciales, 
    eliminarSuministroParcial 
} from '../controllers/suministroParcialController.js';

const router = express.Router();

router.post('/:solicitudId', checkAuth, crearSuministroParcial);
router.get('/:solicitudId', checkAuth, obtenerSuministrosParciales);
router.delete('/:id', checkAuth, eliminarSuministroParcial);

export default router;