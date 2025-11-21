// src/services/ticketService.js
import api from './api';

const ticketService = {
  async create(ticketData) {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/tickets');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  async validate(id) {
    const response = await api.put(`/tickets/${id}/validar`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  }
};

export default ticketService;