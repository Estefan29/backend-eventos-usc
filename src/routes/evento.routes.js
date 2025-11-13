import express from 'express';
import { crearEvento, listarEventos, obtenerEvento } from '../controllers/evento.controller.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

// Crear evento (solo admin)
router.post('/', auth, crearEvento);

// Listar todos
router.get('/', listarEventos);

// Obtener uno
router.get('/:id', obtenerEvento);

export default router;
