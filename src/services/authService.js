// src/services/authService.js
import api from './api';

const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/registro', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);

      const token = response.data.token;
      const usuario = response.data.usuario; // <-- CONFIRMAR CON TU BACKEND

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(usuario));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.rol === 'admin';
  }
};

export default authService;
