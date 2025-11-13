import prisma from '../prisma/client.js';

// Crear un nuevo evento
export const crearEvento = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      tipo_evento,
      tipo_pago,
      precio,
      lugar,
      direccion,
      fecha_inicio,
      fecha_fin,
      inicio_inscripcion,
      fin_inscripcion,
      capacidad,
      cupos_disponibles,
      url_imagen
    } = req.body;

    // Validar campos obligatorios
    if (
      !titulo ||
      !descripcion ||
      !tipo_evento ||
      !tipo_pago ||
      !lugar ||
      !fecha_inicio ||
      !fecha_fin ||
      !inicio_inscripcion ||
      !fin_inscripcion ||
      !capacidad ||
      !cupos_disponibles
    ) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    // Crear evento
    const nuevoEvento = await prisma.eventos.create({
      data: {
        titulo,
        descripcion,
        tipo_evento,
        tipo_pago,
        precio: tipo_pago === 'GRATUITO' ? 0 : precio,
        lugar,
        direccion,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        inicio_inscripcion: new Date(inicio_inscripcion),
        fin_inscripcion: new Date(fin_inscripcion),
        capacidad: Number(capacidad),
        cupos_disponibles: Number(cupos_disponibles),
        url_imagen,
        activo: true,
        // Si tienes autenticación con usuario ADMIN
        creado_por: req.user?.id || null
      }
    });

    res.status(201).json({
      mensaje: 'Evento creado exitosamente ',
      evento: nuevoEvento
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ mensaje: 'Error al crear evento', error: error.message });
  }
};

// Listar todos los eventos
export const listarEventos = async (req, res) => {
  try {
    const eventos = await prisma.eventos.findMany({
      orderBy: { fecha_inicio: 'asc' }
    });
    res.json(eventos);
  } catch (error) {
    console.error(' Error al listar eventos:', error);
    res.status(500).json({ mensaje: 'Error al listar eventos', error: error.message });
  }
};

// Obtener evento por ID
export const obtenerEvento = async (req, res) => {
  try {
    const evento = await prisma.eventos.findUnique({
      where: { id: req.params.id }
    });
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json(evento);
  } catch (error) {
    console.error(' Error al obtener evento:', error);
    res.status(500).json({ mensaje: 'Error al obtener evento', error: error.message });
  }
};
