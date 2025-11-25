import express from 'express';
import {
  crearEvento,
  listarEventos,
  obtenerEvento,
  editarEvento,
  eliminarEvento,
  activarEvento,
  desactivarEvento
} from '../controllers/evento.controller.js';
import auth from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { eventoSchema } from "../validations/evento.schema.js";

const router = express.Router();

// Rutas públicas
router.get('/', listarEventos);
router.get('/:id', obtenerEvento);

// Rutas protegidas (solo admin)
router.post('/', auth, esAdministrador, crearEvento);
router.put('/:id', auth, esAdministrador, actualizarEvento);
router.delete('/:id', auth, esAdministrador, eliminarEvento);

export default router;

