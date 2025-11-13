import {
  crearTicket,
  obtenerTickets,
  obtenerTicketPorId,
  validarTicket,
  eliminarTicket,
} from "../services/ticketService.js";

export const crearTicketController = async (req, res) => {
  try {
    const { inscripcion_id } = req.body;
    const ticket = await crearTicket(inscripcion_id);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear ticket", error: error.message });
  }
};

export const obtenerTicketsController = async (req, res) => {
  try {
    const tickets = await obtenerTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener tickets", error: error.message });
  }
};

export const obtenerTicketPorIdController = async (req, res) => {
  try {
    const ticket = await obtenerTicketPorId(req.params.id);
    res.json(ticket);
  } catch (error) {
    res.status(404).json({ mensaje: "Ticket no encontrado", error: error.message });
  }
};

export const validarTicketController = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const ticket = await validarTicket(id, usuarioId);
    res.json({ mensaje: "Ticket validado correctamente", ticket });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al validar ticket", error: error.message });
  }
};

export const eliminarTicketController = async (req, res) => {
  try {
    await eliminarTicket(req.params.id);
    res.json({ mensaje: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar ticket", error: error.message });
  }
};
