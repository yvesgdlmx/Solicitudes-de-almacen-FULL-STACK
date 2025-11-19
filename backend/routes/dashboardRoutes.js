import express from 'express';
import { obtenerDashboardUsuario} from '../controllers/dashboardController.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router();

router.get('/usuario', checkAuth, obtenerDashboardUsuario);

export default router;