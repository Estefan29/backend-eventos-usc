<template>
  <div class="events-page">
    <!-- Navbar Superior -->
    <div class="navbar">
      <div class="navbar-brand">
        📅 EVENTOS USC
      </div>
    </div>

    <!-- Contenedor Principal -->
    <div class="main-container">
      <!-- Sidebar Izquierdo -->
      <div class="sidebar">
        <router-link to="/eventos" class="menu-item active">
          <span class="icon">🏠</span>
          Inicio
        </router-link>
        <router-link to="/mis-tickets" class="menu-item">
          <span class="icon">🎫</span>
          Mis Tickets
        </router-link>
        <router-link to="/perfil" class="menu-item">
          <span class="icon">👤</span>
          Perfil
        </router-link>
      </div>

      <!-- Contenido Principal -->
      <div class="content">
        <!-- Barra de Búsqueda -->
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Buscar eventos"
            @input="filterEvents"
          />
        </div>

        <!-- Próximos Eventos -->
        <section class="events-section">
          <h2>Próximos Eventos</h2>
          <div class="events-row">
            <div
              v-for="evento in proximosEventos"
              :key="evento.id"
              class="event-card"
              @click="goToDetail(evento.id)"
            >
              <img
                :src="evento.imagen || 'https://via.placeholder.com/300x150'"
                :alt="evento.nombre"
              />
              <div class="event-details">
                <h3>{{ evento.nombre }}</h3>
                <p class="event-date">{{ formatDate(evento.fecha) }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Eventos Destacados -->
        <section class="events-section">
          <h2>Eventos Destacados</h2>
          <div class="events-row">
            <div
              v-for="evento in eventosDestacados"
              :key="evento.id"
              class="event-card"
              @click="goToDetail(evento.id)"
            >
              <img
                :src="evento.imagen || 'https://via.placeholder.com/300x150'"
                :alt="evento.nombre"
              />
              <div class="event-details">
                <h3>{{ evento.nombre }}</h3>
                <p class="event-location">{{ evento.ubicacion }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import eventoService from '../../services/eventoService';

const router = useRouter();
const eventos = ref([]);
const searchQuery = ref('');

const proximosEventos = computed(() => {
  let filtered = eventos.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(e => 
      e.nombre.toLowerCase().includes(query) ||
      e.categoria?.toLowerCase().includes(query)
    );
  }
  
  return filtered.slice(0, 3);
});

const eventosDestacados = computed(() => {
  let filtered = eventos.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(e => 
      e.nombre.toLowerCase().includes(query) ||
      e.ubicacion?.toLowerCase().includes(query)
    );
  }
  
  return filtered.slice(3, 6);
});

const loadEventos = async () => {
  try {
    const data = await eventoService.getAll();
    eventos.value = data.eventos || data;
  } catch (error) {
    console.error('Error cargando eventos:', error);
  }
};

const filterEvents = () => {
  // La filtración se hace automáticamente con computed
};

const goToDetail = (id) => {
  router.push(`/eventos/${id}`);
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

onMounted(() => {
  loadEventos();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.events-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Navbar Superior */
.navbar {
  background: #2196F3;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
}

/* Contenedor Principal */
.main-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: calc(100vh - 60px);
}

/* Sidebar */
.sidebar {
  background: white;
  padding: 1rem 0;
  border-right: 1px solid #e0e0e0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.5rem;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.menu-item .icon {
  font-size: 1.1rem;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #333;
}

.menu-item.active {
  background: #e3f2fd;
  color: #2196F3;
  border-right: 3px solid #2196F3;
}

/* Contenido Principal */
.content {
  padding: 2rem;
  max-width: 1200px;
}

/* Barra de Búsqueda */
.search-bar {
  margin-bottom: 2rem;
}

.search-bar input {
  width: 100%;
  max-width: 500px;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
}

.search-bar input:focus {
  outline: none;
  border-color: #2196F3;
}

/* Secciones de Eventos */
.events-section {
  margin-bottom: 3rem;
}

.events-section h2 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.events-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Tarjetas de Eventos */
.event-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.event-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.event-details {
  padding: 1rem;
}

.event-details h3 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.event-date,
.event-location {
  font-size: 0.85rem;
  color: #666;
}

/* Responsive */
@media (max-width: 1024px) {
  .events-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .events-row {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 1.5rem;
  }
}
</style>