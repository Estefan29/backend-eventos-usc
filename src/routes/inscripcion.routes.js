import express from 'express';
import { 
  inscribirUsuario, 
  listarInscripciones,
  obtenerInscripcion,
  cancelarInscripcion,
  registrarAsistencia
} from '../controllers/inscripcion.controller.js';
import auth from '../middlewares/authMiddleware.js';
import { esAdministrador } from '../middlewares/rolesMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.post('/', auth, inscribirUsuario);
router.get('/', auth, listarInscripciones);
router.get('/:id', auth, obtenerInscripcion);
router.put('/:id/cancelar', auth, cancelarInscripcion);
router.put('/:id/asistencia', auth, esAdministrador, registrarAsistencia);

export default router;
