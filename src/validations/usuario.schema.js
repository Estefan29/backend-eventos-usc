
/**
 * Valida el email
 */
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida la contraseña (mínimo 6 caracteres)
 */
const validarContrasena = (contrasena) => {
  return contrasena && contrasena.length >= 6;
};

/**
 * Middleware de validación para registro
 */
export const registroSchema = (req, res, next) => {
  const { correo, contrasena, nombre, apellido, rol } = req.body;
  
  const errores = [];

  if (!correo) {
    errores.push('El correo es obligatorio');
  } else if (!validarEmail(correo)) {
    errores.push('El correo no es válido');
  }

  if (!contrasena) {
    errores.push('La contraseña es obligatoria');
  } else if (!validarContrasena(contrasena)) {
    errores.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (!nombre || nombre.trim() === '') {
    errores.push('El nombre es obligatorio');
  }

  if (!apellido || apellido.trim() === '') {
    errores.push('El apellido es obligatorio');
  }

  if (!rol) {
    errores.push('El rol es obligatorio');
  } else {
    const rolesValidos = ['ADMINISTRADOR', 'ESTUDIANTE', 'PROFESOR', 'INVITADO'];
    if (!rolesValidos.includes(rol)) {
      errores.push('El rol no es válido');
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({
      mensaje: 'Errores de validación',
      errores
    });
  }

  next();
};

/**
 * Middleware de validación para login
 */
export const loginSchema = (req, res, next) => {
  const { correo, contrasena } = req.body;
  
  const errores = [];

  if (!correo) {
    errores.push('El correo es obligatorio');
  } else if (!validarEmail(correo)) {
    errores.push('El correo no es válido');
  }

  if (!contrasena) {
    errores.push('La contraseña es obligatoria');
  }

  if (errores.length > 0) {
    return res.status(400).json({
      mensaje: 'Errores de validación',
      errores
    });
  }

  next();
};

/**
 * Middleware de validación para eventos
 */
export const eventoSchema = (req, res, next) => {
  const {
    titulo,
    descripcion,
    tipo_evento,
    tipo_pago,
    lugar,
    fecha_inicio,
    fecha_fin,
    inicio_inscripcion,
    fin_inscripcion,
    capacidad
  } = req.body;
  
  const errores = [];

  if (!titulo || titulo.trim() === '') {
    errores.push('El título es obligatorio');
  }

  if (!descripcion || descripcion.trim() === '') {
    errores.push('La descripción es obligatoria');
  }

  if (!tipo_evento) {
    errores.push('El tipo de evento es obligatorio');
  }

  if (!tipo_pago) {
    errores.push('El tipo de pago es obligatorio');
  }

  if (!lugar || lugar.trim() === '') {
    errores.push('El lugar es obligatorio');
  }

  if (!fecha_inicio) {
    errores.push('La fecha de inicio es obligatoria');
  }

  if (!fecha_fin) {
    errores.push('La fecha de fin es obligatoria');
  }

  if (!inicio_inscripcion) {
    errores.push('La fecha de inicio de inscripción es obligatoria');
  }

  if (!fin_inscripcion) {
    errores.push('La fecha de fin de inscripción es obligatoria');
  }

  if (!capacidad || capacidad < 1) {
    errores.push('La capacidad debe ser mayor a 0');
  }

  if (errores.length > 0) {
    return res.status(400).json({
      mensaje: 'Errores de validación',
      errores
    });
  }

  next();
};

export default {
  registroSchema,
  loginSchema,
  eventoSchema
};