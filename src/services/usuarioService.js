// src/services/usuarioService.js
import api from './api';

const usuarioService = {
  async getAll() {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async update(id, userData) {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }
};

export default usuarioService;