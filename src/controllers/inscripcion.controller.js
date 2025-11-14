 import prisma from '../prisma/client.js';

// Inscribir a un usuario en un evento
export const inscribirUsuario = async (req, res) => {
  try {
    const { usuarioId, eventoId } = req.body;

    // No usar parseInt: los IDs son strings (UUID)
    const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    const inscripcion = await prisma.inscripcion.create({
      data: {
        usuario_id: usuarioId,
        evento_id: eventoId,
        estado: evento.tipo_pago === 'PAGO' ? 'PENDIENTE' : 'APROBADO',
      },
    });

    res.status(201).json({ mensaje: 'Inscripción realizada', inscripcion });
  } catch (error) {
    console.error('Error al inscribir usuario:', error);
    res.status(500).json({ mensaje: 'Error al inscribir usuario', error: error.message });
  }
};

// Listar inscripciones
export const listarInscripciones = async (req, res) => {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      include: { usuario: true, evento: true },
    });
    res.json(inscripciones);
  } catch (error) {
    console.error('Error al listar inscripciones:', error);
    res.status(500).json({ mensaje: 'Error al listar inscripciones', error: error.message });
  }
};
