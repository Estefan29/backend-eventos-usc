/**
 * Middleware para verificar roles de usuario
 * @param {Array<string>} rolesPermitidos - Array de roles que tienen acceso
 * @returns {Function} Middleware de Express
 */
export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return res.status(401).json({ mensaje: 'Usuario no autenticado' });
      }

      // Verificar que el rol del usuario esté en los roles permitidos
      if (!rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ 
          mensaje: 'No tienes permisos para realizar esta acción',
          rolRequerido: rolesPermitidos,
          rolActual: req.user.rol
        });
      }

      next();
    } catch (error) {
      console.error('❌ Error en verificación de rol:', error);
      res.status(500).json({ mensaje: 'Error al verificar permisos' });
    }
  };
};

/**
 * Middleware para verificar si es administrador
 */
export const esAdministrador = verificarRol(['ADMINISTRADOR']);

/**
 * Middleware para verificar si es estudiante o administrador
 */
export const esEstudianteOAdmin = verificarRol(['ESTUDIANTE', 'ADMINISTRADOR']);

/**
 * Middleware para verificar si es profesor o administrador
 */
export const esProfesorOAdmin = verificarRol(['PROFESOR', 'ADMINISTRADOR']);

export default {
  verificarRol,
  esAdministrador,
  esEstudianteOAdmin,
  esProfesorOAdmin
};