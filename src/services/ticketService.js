import prisma from "../prisma/client.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

/** Crear un ticket (cuando se confirma un pago)
 * @param {string} inscripcionId
 * @returns {object} ticket creado
 */
export const crearTicket = async (inscripcionId) => {
  try {
    const codigo_ticket = `TCK-${uuidv4().split("-")[0].toUpperCase()}`;
    const datosQR = `Ticket: ${codigo_ticket} | Inscripción: ${inscripcionId}`;
    const codigo_qr = await QRCode.toDataURL(datosQR);

    const ticket = await prisma.ticket.create({
      data: {
        inscripcion_id: inscripcionId,
        codigo_ticket,
        codigo_qr,
      },
    });

    return ticket;
  } catch (error) {
    console.error("Error al crear ticket:", error);
    throw new Error("No se pudo crear el ticket");
  }
};

/*Obtener todos los tickets*/
export const obtenerTickets = async () => {
  return prisma.ticket.findMany({
    include: {
      inscripcion: {
        include: { usuario: true, evento: true },
      },
    },
  });
};

/*Obtener ticket por ID*/
export const obtenerTicketPorId = async (id) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      inscripcion: {
        include: { usuario: true, evento: true },
      },
    },
  });

  if (!ticket) throw new Error("Ticket no encontrado");
  return ticket;
};

/*validar ticket (marcar como usado)*/
export const validarTicket = async (id, usuarioId) => {
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) throw new Error("Ticket no encontrado");
  if (!ticket.valido) throw new Error("El ticket ya fue usado");

  return prisma.ticket.update({
    where: { id },
    data: {
      valido: false,
      validado_en: new Date(),
      validador: { connect: { id: usuarioId } }, // conectar el usuario que valida
    },
  });
};

/*Eliminar ticket*/
export const eliminarTicket = async (id) => {
  return prisma.ticket.delete({ where: { id } });
};
