// src/services/eventoService.js
import api from './api';

const eventoService = {
  async getAll() {
    const response = await api.get('/eventos');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  },

  async create(eventoData) {
    const response = await api.post('/eventos', eventoData);
    return response.data;
  }
};

export default eventoService;