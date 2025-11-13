import * as pagoService from '../services/pagoService.js';

export const registrarPago = async (req, res) => {
  try {
    const nuevoPago = await pagoService.crearPago(req.body);
    res.status(201).json({ mensaje: 'Pago registrado con éxito', pago: nuevoPago });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al registrar pago', error: error.message });
  }
};

export const listarPagos = async (req, res) => {
  try {
    const pagos = await pagoService.obtenerPagos();
    res.json(pagos);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al listar pagos', error: error.message });
  }
};

export const obtenerPago = async (req, res) => {
  try {
    const pago = await pagoService.obtenerPagoPorId(req.params.id);
    if (!pago) return res.status(404).json({ mensaje: 'Pago no encontrado' });
    res.json(pago);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al obtener pago', error: error.message });
  }
};

export const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const pago = await pagoService.actualizarEstadoPago(req.params.id, estado);
    res.json({ mensaje: 'Estado de pago actualizado', pago });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar estado', error: error.message });
  }
};
