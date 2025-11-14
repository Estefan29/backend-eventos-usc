import express from 'express';
import { registrarPago, listarPagos, actualizarEstado } from '../controllers/pago.controller.js';

const router = express.Router();

router.post('/', registrarPago);
router.get('/', listarPagos);
router.put('/:id', actualizarEstado); // <-- ruta para actualizar estado del pago

export default router;
