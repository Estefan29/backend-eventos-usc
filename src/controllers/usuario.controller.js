import prisma from '../prisma/client.js';

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, correo: true, rol: true },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar usuarios', error: error.message });
  }
};

// Obtener usuario por ID
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.params.id },
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
};


// Actualizar datos del usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, correo, rol } = req.body;
    const { id } = req.params; // este debe ser el UUID

    const dataToUpdate = {};
    if (nombre) dataToUpdate.nombre = nombre;
    if (correo) dataToUpdate.correo = correo;
    if (rol) dataToUpdate.rol = rol;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ mensaje: "No hay campos para actualizar" });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({ mensaje: "Usuario actualizado", usuario: usuarioActualizado });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(400).json({ mensaje: "Error al actualizar usuario", error: error.message });
  }
};


// Eliminar usuario
// Eliminar usuario de forma segura
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Primero eliminamos dependencias (inscripciones, tickets, pagos)
    await prisma.pago.deleteMany({
      where: { inscripcion: { usuario_id: id } },
    });

    await prisma.ticket.deleteMany({
      where: { inscripcion: { usuario_id: id } },
    });

    await prisma.inscripcion.deleteMany({
      where: { usuario_id: id },
    });

    // Finalmente eliminamos el usuario
    await prisma.usuario.delete({ where: { id } });

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};

