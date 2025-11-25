import prisma from "../config/prismaClient.js";

/**
 * Crear inscripción con TODAS LAS VALIDACIONES
 */
export const crearInscripcionService = async ({ usuario_id, evento_id }) => {
  // 1. Validar usuario existe
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuario_id },
  });
  if (!usuario) {
    throw { status: 404, message: "El usuario no existe" };
  }

  // 2. Validar evento existe
  const evento = await prisma.evento.findUnique({
    where: { id: evento_id },
  });
  if (!evento) {
    throw { status: 404, message: "El evento no existe" };
  }

  // 3. Validar que el usuario no este inscrito ya
  const existente = await prisma.inscripcion.findUnique({
    where: {
      usuario_id_evento_id: {
        usuario_id,
        evento_id,
      },
    },
  });

  if (existente) {
    throw { status: 400, message: "La inscripción ya existe" };
  }

  // 4. Validar cupos
  if (evento.cupos_disponibles <= 0) {
    throw { status: 400, message: "No hay cupos disponibles" };
  }

  // 5. Validar fechas de inscripción
  const ahora = new Date();
  if (ahora < new Date(evento.inicio_inscripcion) || ahora > new Date(evento.fin_inscripcion)) {
    throw { status: 400, message: "Fuera de fecha de inscripción" };
  }

  // 6. Crear inscripción
  const inscripcion = await prisma.inscripcion.create({
    data: {
      usuario_id,
      evento_id,
      estado: "PENDIENTE",
    },
  });

  // 7. Restar cupo
  await prisma.evento.update({
    where: { id: evento.id },
    data: {
      cupos_disponibles: evento.cupos_disponibles - 1,
    },
  });

  return inscripcion;
};


/**
 * Listar inscripciones
 */
export const listarInscripcionesService = async (filtros) => {
  return prisma.inscripcion.findMany({
    where: {
      usuario_id: filtros.usuario_id || undefined,
      evento_id: filtros.evento_id || undefined,
    },
  });
};


/**
 * Obtener inscripción por ID
 */
export const obtenerInscripcionPorIdService = async (id) => {
  const inscripcion = await prisma.inscripcion.findUnique({ where: { id } });

  if (!inscripcion) {
    throw { status: 404, message: "Inscripción no encontrada" };
  }

  return inscripcion;
};


/**
 * Cancelar inscripción
 */
export const cancelarInscripcionService = async (id) => {
  const inscripcion = await prisma.inscripcion.findUnique({
    where: { id },
  });

  if (!inscripcion) {
    throw { status: 404, message: "Inscripción no existe" };
  }

  if (inscripcion.estado === "CANCELADA") {
    throw { status: 400, message: "La inscripción ya está cancelada" };
  }

  return prisma.inscripcion.update({
    where: { id },
    data: {
      estado: "CANCELADA",
      fecha_cancelacion: new Date(),
    },
  });
};
