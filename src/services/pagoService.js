// src/services/pagoService.js
import api from './api';

const pagoService = {
  async create(pagoData) {
    const response = await api.post('/pagos', pagoData);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/pagos');
    return response.data;
  },

  async updateStatus(id, estado) {
    const response = await api.put(`/pagos/${id}`, { estado });
    return response.data;
  }
};

export default pagoService;