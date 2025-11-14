import prisma from "../prisma/client.js";

// =========================
//   Crear inscripción
// =========================
export const crearInscripcion = async (req, res) => {
  try {
    const { usuario_id, evento_id } = req.body;

    if (!usuario_id || !evento_id) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    // Verificar usuario
    const usuario = await prisma.usuario.findUnique({ where: { id: usuario_id } });
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    if (!usuario.activo)
      return res.status(400).json({ mensaje: "El usuario no está activo" });

    // Verificar evento
    const evento = await prisma.evento.findUnique({ where: { id: evento_id } });
    if (!evento) return res.status(404).json({ mensaje: "Evento no encontrado" });

    if (!evento.activo)
      return res.status(400).json({ mensaje: "El evento no está activo" });

    // Inscripción duplicada
    const existente = await prisma.inscripcion.findFirst({
      where: { usuario_id, evento_id }
    });

    if (existente)
      return res.status(400).json({ mensaje: "Ya estás inscrito en este evento" });

    // Capacidad
    if (evento.cupos_disponibles <= 0)
      return res.status(400).json({ mensaje: "No hay cupos disponibles" });

    const ahora = new Date();

    // Plazo
    if (ahora < evento.inicio_inscripcion || ahora > evento.fin_inscripcion)
      return res.status(400).json({ mensaje: "Inscripción fuera del plazo" });

    // Evento finalizado
    if (ahora > evento.fecha_fin)
      return res.status(400).json({ mensaje: "El evento ya finalizó" });

    // Crear inscripción
    const nueva = await prisma.inscripcion.create({
      data: {
        usuario_id,
        evento_id,
        estado: "PENDIENTE"
      }
    });

    // Restar cupos
    await prisma.evento.update({
      where: { id: evento_id },
      data: { cupos_disponibles: evento.cupos_disponibles - 1 }
    });

    res.status(201).json(nueva);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al inscribir usuario", error: error.message });
  }
};


// =========================
//   Listar inscripciones
// =========================
export const obtenerInscripciones = async (req, res) => {
  try {
    const list = await prisma.inscripcion.findMany({
      include: { usuario: true, evento: true }
    });

    res.json(list);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar inscripciones", error: error.message });
  }
};


// =========================
//   Obtener inscripción por ID
// =========================
export const obtenerInscripcionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id },
      include: { usuario: true, evento: true }
    });

    if (!inscripcion)
      return res.status(404).json({ mensaje: "Inscripción no encontrada" });

    res.json(inscripcion);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener inscripción", error: error.message });
  }
};


// =========================
//   Cancelar inscripción
// =========================
export const cancelarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;

    const inscripcion = await prisma.inscripcion.findUnique({ where: { id } });
    if (!inscripcion)
      return res.status(404).json({ mensaje: "Inscripción no encontrada" });

    const cancelada = await prisma.inscripcion.update({
      where: { id },
      data: {
        estado: "CANCELADA",
        fecha_cancelacion: new Date()
      }
    });

    res.json({ mensaje: "Inscripción cancelada", inscripcion: cancelada });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al cancelar inscripción", error: error.message });
  }
};
