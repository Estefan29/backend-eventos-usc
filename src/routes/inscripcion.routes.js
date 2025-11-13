import express from 'express';
import { inscribirUsuario, listarInscripciones } from '../controllers/inscripcion.controller.js';

const router = express.Router();

router.post('/', inscribirUsuario);
router.get('/', listarInscripciones);

export default router;
