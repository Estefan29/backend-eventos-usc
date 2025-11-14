import prisma from "../prisma/client.js";

// Crear un pago
export const crearPago = async (data) => {
  try {
    const nuevoPago = await prisma.pago.create({
      data: {
        inscripcion_id: data.inscripcion_id,
        metodo_pago: data.metodo_pago,
        referencia: data.referencia,
        monto: data.monto,
        estado: data.estado, // PENDIENTE o APROBADO
        comprobante_url: data.comprobante_url,
      },
    });

    return nuevoPago;
  } catch (error) {
    console.error("Error al crear pago:", error);
    throw new Error("No se pudo registrar el pago");
  }
};

// Obtener todos los pagos
export const obtenerPagos = async () => {
  return await prisma.pago.findMany({
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

// Obtener un pago por ID
export const obtenerPagoPorId = async (id) => {
  return await prisma.pago.findUnique({
    where: { id },
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

// Actualizar el estado de un pago
export const actualizarEstadoPago = async (id, estado) => {
  return await prisma.pago.update({
    where: { id },
    data: { estado },
  });
};
