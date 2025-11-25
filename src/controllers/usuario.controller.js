import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt';

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const { rol, activo } = req.query;
    
    const filtros = {};
    if (rol) filtros.rol = rol;
    if (activo !== undefined) filtros.activo = activo === 'true';

    const usuarios = await prisma.usuario.findMany({
      where: filtros,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        tipo_usuario: true,
        telefono: true,
        activo: true,
        correo_verificado: true,
        creado_en: true
      },
      orderBy: {
        creado_en: 'desc'
      }
    });

    res.json(usuarios);
  } catch (error) {
    console.error('s Error al listar usuarios:', error);
    res.status(500).json({ mensaje: 'Error al listar usuarios', error: error.message });
  }
};

// Obtener usuario por ID
export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        tipo_usuario: true,
        tipo_documento: true,
        numero_documento: true,
        telefono: true,
        activo: true,
        correo_verificado: true,
        creado_en: true,
        actualizado_en: true,
        _count: {
          select: {
            inscripciones: true,
            eventosCreados: true
          }
        }
      }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error(' Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
};

// Obtener perfil del usuario autenticado
export const obtenerPerfil = async (req, res) => {
  try {
    const { id } = req.user;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        tipo_usuario: true,
        tipo_documento: true,
        numero_documento: true,
        telefono: true,
        correo_verificado: true,
        creado_en: true,
        inscripciones: {
          include: {
            evento: true,
            ticket: true
          }
        }
      }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error(' Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
};

// Actualizar datos del usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      telefono,
      tipo_documento,
      numero_documento,
      rol
    } = req.body;

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Preparar datos para actualizar
    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (apellido) datosActualizar.apellido = apellido;
    if (telefono) datosActualizar.telefono = telefono;
    if (tipo_documento) datosActualizar.tipo_documento = tipo_documento;
    if (numero_documento) datosActualizar.numero_documento = numero_documento;
    if (rol) datosActualizar.rol = rol;

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: datosActualizar,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        telefono: true,
        tipo_documento: true,
        numero_documento: true,
        actualizado_en: true
      }
    });

    res.json({
      mensaje: 'Usuario actualizado correctamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error(' Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

// Actualizar perfil del usuario autenticado
export const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      nombre,
      apellido,
      telefono,
      tipo_documento,
      numero_documento
    } = req.body;

    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (apellido) datosActualizar.apellido = apellido;
    if (telefono) datosActualizar.telefono = telefono;
    if (tipo_documento) datosActualizar.tipo_documento = tipo_documento;
    if (numero_documento) datosActualizar.numero_documento = numero_documento;

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: datosActualizar,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        telefono: true,
        tipo_documento: true,
        numero_documento: true
      }
    });

    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error(' Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message });
  }
};

// Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
  try {
    const { id } = req.user;
    const { contrasena_actual, contrasena_nueva } = req.body;

    if (!contrasena_actual || !contrasena_nueva) {
      return res.status(400).json({ mensaje: 'Debe proporcionar la contraseña actual y la nueva' });
    }

    // Obtener usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(contrasena_actual, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    // Hash de la nueva contraseña
    const nuevaContrasenaHash = await bcrypt.hash(contrasena_nueva, 10);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id },
      data: { contrasena: nuevaContrasenaHash }
    });

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(' Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: 'Error al cambiar contraseña', error: error.message });
  }
};

// Desactivar usuario (soft delete)
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Soft delete: marcar como inactivo
    await prisma.usuario.update({
      where: { id },
      data: { activo: false }
    });

    res.json({ mensaje: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error(' Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};

// Activar usuario
export const activarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    await prisma.usuario.update({
      where: { id },
      data: { activo: true }
    });

    res.json({ mensaje: 'Usuario activado correctamente' });
  } catch (error) {
    console.error(' Error al activar usuario:', error);
    res.status(500).json({ mensaje: 'Error al activar usuario', error: error.message });
  }
};