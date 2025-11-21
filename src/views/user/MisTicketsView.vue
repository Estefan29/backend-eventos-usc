<template>
  <div class="tickets-page">
    <!-- Navbar Superior -->
    <div class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">📅 EVENTOS USC</div>
        <div class="navbar-links">
          <router-link to="/eventos">Inicio</router-link>
          <router-link to="/mis-tickets" class="active">Mis Tickets</router-link>
          <router-link to="/perfil">Perfil</router-link>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="tickets-container">
      <h1>MIS TICKETS</h1>

      <div v-if="loading" class="loading">
        Cargando tickets...
      </div>

      <div v-else-if="tickets.length > 0" class="tickets-list">
        <div
          v-for="ticket in tickets"
          :key="ticket.id"
          class="ticket-item"
        >
          <div class="ticket-info">
            <h3>{{ ticket.evento_nombre || 'Evento' }}</h3>
            <p class="ticket-date">Fecha: {{ formatDate(ticket.fecha_evento) }}</p>
            <p class="ticket-time">Hora: {{ ticket.hora || '7:00 PM' }}</p>
          </div>
          <button @click="viewTicketDetail(ticket.id)" class="btn-ver">
            Ver
          </button>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No tienes tickets aún</p>
        <router-link to="/eventos" class="btn-explorar">
          Explorar eventos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ticketService from '../../services/ticketService';
import authService from '../../services/authService';

const router = useRouter();
const loading = ref(true);
const tickets = ref([]);

const loadTickets = async () => {
  loading.value = true;
  try {
    const data = await ticketService.getAll();
    tickets.value = data.tickets || data;
  } catch (error) {
    console.error('Error cargando tickets:', error);
  } finally {
    loading.value = false;
  }
};

const viewTicketDetail = (ticketId) => {
  // Puedes crear una vista de detalle de ticket si lo necesitas
  alert(`Ver detalles del ticket ${ticketId}`);
};

const formatDate = (date) => {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login');
    return;
  }
  loadTickets();
});
</script>

<style scoped>
.tickets-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Navbar */
.navbar {
  background: #2196F3;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
}

.navbar-links {
  display: flex;
  gap: 2rem;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.3s;
}

.navbar-links a:hover,
.navbar-links a.active {
  background: rgba(255, 255, 255, 0.2);
}

/* Contenedor de Tickets */
.tickets-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.tickets-container h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

/* Lista de Tickets */
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ticket-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.ticket-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.ticket-info h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.ticket-date,
.ticket-time {
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0;
}

.btn-ver {
  padding: 0.6rem 1.5rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-ver:hover {
  background: #1976D2;
}

/* Estado Vacío */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-state p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.btn-explorar {
  display: inline-block;
  padding: 0.9rem 2rem;
  background: #2196F3;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-explorar:hover {
  background: #1976D2;
}

/* Responsive */
@media (max-width: 768px) {
  .tickets-container {
    padding: 2rem 1rem;
  }

  .navbar-links {
    gap: 1rem;
  }

  .navbar-links a {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }

  .ticket-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-ver {
    width: 100%;
  }
}
</style>