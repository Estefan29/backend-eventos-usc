import express from 'express';
import {
  listarUsuarios,
  obtenerUsuario,
  obtenerPerfil,
  actualizarUsuario,
  actualizarPerfil,
  cambiarContrasena,
  eliminarUsuario,
  activarUsuario
} from '../controllers/usuario.controller.js';
import auth from '../middlewares/authMiddleware.js';
import { esAdministrador } from '../middlewares/rolesMiddleware.js';

const router = express.Router();

// Rutas de perfil (cualquier usuario autenticado)
router.get('/perfil', auth, obtenerPerfil);
router.put('/perfil', auth, actualizarPerfil);
router.put('/cambiar-contrasena', auth, cambiarContrasena);

// Rutas de administración (solo admin)
router.get('/', auth, esAdministrador, listarUsuarios);
router.get('/:id', auth, esAdministrador, obtenerUsuario);
router.put('/:id', auth, esAdministrador, actualizarUsuario);
router.delete('/:id', auth, esAdministrador, eliminarUsuario);
router.put('/:id/activar', auth, esAdministrador, activarUsuario);

export default router;

