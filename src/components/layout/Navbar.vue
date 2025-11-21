<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/eventos" class="navbar-brand">
        🎫 EVENTOS USC
      </router-link>

      <div class="navbar-menu">
        <router-link to="/eventos" class="navbar-item">Eventos</router-link>

        <template v-if="isAuthenticated">
          <router-link to="/mis-tickets" class="navbar-item">Mis Tickets</router-link>
          <router-link to="/perfil" class="navbar-item">Perfil</router-link>
          <button @click="handleLogout" class="navbar-item btn-logout">Salir</button>
        </template>

        <template v-else>
          <router-link to="/login" class="navbar-item btn-primary">Iniciar sesión</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

const router = useRouter();

const isAuthenticated = computed(() => authService.isAuthenticated());

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.navbar-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.navbar-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-primary {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
}
</style>