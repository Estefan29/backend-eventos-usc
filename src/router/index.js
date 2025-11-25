 // src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService.js';

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import RecoverPasswordView from '../views/auth/RecoverPasswordView.vue';
import EventsView from '../views/events/EventsView.vue';
import EventDetailView from '../views/events/EventDetailView.vue';
import MisTicketsView from '../views/user/MisTicketsView.vue';
import PerfilView from '../views/user/PerfilView.vue';

// Vistas Admin
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';
import AdminEventosView from '../views/admin/AdminEventosView.vue';
import AdminCrearEventoView from '../views/admin/AdminCrearEventoView.vue';
import AdminUsuariosView from '../views/admin/AdminUsuariosView.vue';
import AdminEditarEventoView from '../views/admin/AdminEditarEventoView.vue';

const routes = [
  {
    path: '/',
    redirect: '/eventos'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/registro',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/recuperar-contrasena',
    name: 'RecoverPassword',
    component: RecoverPasswordView,
    meta: { requiresGuest: true }
  },
  {
    path: '/eventos',
    name: 'Events',
    component: EventsView
  },
  {
    path: '/eventos/:id',
    name: 'EventDetail',
    component: EventDetailView
  },
  {
    path: '/mis-tickets',
    name: 'MyTickets',
    component: MisTicketsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: PerfilView,
    meta: { requiresAuth: true }
  },
  // RUTAS ADMIN
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/eventos',
    name: 'AdminEventos',
    component: AdminEventosView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/eventos/crear',
    name: 'AdminCrearEvento',
    component: AdminCrearEventoView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/eventos/editar/:id',
    name: 'AdminEditarEvento',
    component: AdminEditarEventoView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/usuarios',
    name: 'AdminUsuarios',
    component: AdminUsuariosView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  // Rutas que requieren estar NO autenticado
  if (to.meta.requiresGuest && isAuthenticated) {
    if (isAdmin) {
      return next('/admin');
    }
    return next('/eventos');
  }

  // Rutas que requieren autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  // Rutas que requieren ser admin
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/eventos');
  }

  next();
});

export default router;