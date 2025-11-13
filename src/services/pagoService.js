import prisma from "../prisma/client.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

// Crear ticket (se llama desde el servicio de pagos)
export const crearTicket = async (inscripcionId, usuarioId) => {
  try {
    // Generar código único del ticket
    const codigo_ticket = `TCK-${uuidv4().split("-")[0].toUpperCase()}`;

    // Generar QR con la información del ticket
    const datosQR = `Ticket: ${codigo_ticket} | Usuario: ${usuarioId} | Inscripción: ${inscripcionId}`;
    const codigo_qr = await QRCode.toDataURL(datosQR);

    // Crear ticket en la base de datos
    const ticket = await prisma.ticket.create({
      data: {
        inscripcion_id: inscripcionId,
        codigo_ticket,
        codigo_qr,
        valido: true,
      },
    });

    return ticket;
  } catch (error) {
    console.error(" Error al crear ticket:", error);
    throw new Error("No se pudo generar el ticket");
  }
};

// Validar un ticket (cuando se escanea)
export const validarTicket = async (codigo_ticket, validadorId) => {
  try {
    const ticket = await prisma.ticket.findUnique({ where: { codigo_ticket } });
    if (!ticket) throw new Error("Ticket no encontrado");
    if (!ticket.valido) throw new Error("Ticket ya fue utilizado");

    // Marcar como validado
    const ticketValidado = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        valido: false,
        validado_en: new Date(),
        validado_por_id: validadorId,
      },
    });

    return ticketValidado;
  } catch (error) {
    console.error(" Error al validar ticket:", error);
    throw new Error(error.message || "Error al validar ticket");
  }
};

// Obtener todos los tickets (para admin)
export const obtenerTickets = async () => {
  return await prisma.ticket.findMany({
    include: {
      inscripcion: {
        include: {
          usuario: true,
          evento: true,
        },
      },
    },
  });
};
