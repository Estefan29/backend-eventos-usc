// src/services/inscripcionService.js
import api from './api';

const inscripcionService = {
  async create(inscripcionData) {
    const response = await api.post('/inscripciones', inscripcionData);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/inscripciones');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/inscripciones/${id}`);
    return response.data;
  },

  async cancel(id) {
    const response = await api.put(`/inscripciones/${id}/cancelar`);
    return response.data;
  }
};

export default inscripcionService;