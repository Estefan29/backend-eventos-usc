import express from 'express';
import { 
  registrarPago, 
  listarPagos, 
  obtenerPago, 
  actualizarEstado 
} from '../controllers/pago.controller.js';
import auth from '../middlewares/authMiddleware.js';
import { esAdministrador } from '../middlewares/rolesMiddleware.js';

const router = express.Router();

// Crear pago (usuario autenticado)
router.post('/', auth, registrarPago);

// Rutas de admin
router.get('/', auth, esAdministrador, listarPagos);
router.get('/:id', auth, obtenerPago);
router.put('/:id/estado', auth, esAdministrador, actualizarEstado);

export default router;
