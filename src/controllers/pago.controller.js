import * as pagoService from "../services/pagoService.js";

export const crearPago = async (req, res) => {
  try {
    const pago = await pagoService.registrarPago(req.body);
    res.status(201).json({
      mensaje: "Pago registrado correctamente",
      pago,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar el pago",
      error: error.message,
    });
  }
};

export const listarPagos = async (req, res) => {
  try {
    const pagos = await pagoService.listarPagos();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar los pagos",
      error: error.message,
    });
  }
};

export const obtenerPago = async (req, res) => {
  try {
    const pago = await pagoService.obtenerPago(req.params.id);
    if (!pago) return res.status(404).json({ mensaje: "Pago no encontrado" });
    res.json(pago);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el pago",
      error: error.message,
    });
  }
};

export const actualizarPago = async (req, res) => {
  try {
    const pago = await pagoService.actualizarPago(req.params.id, req.body);
    res.json({ mensaje: "Pago actualizado correctamente", pago });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar el pago",
      error: error.message,
    });
  }
};

export const eliminarPago = async (req, res) => {
  try {
    const result = await pagoService.eliminarPago(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el pago",
      error: error.message,
    });
  }
};
