<template>
  <div class="event-detail-page">
    <!-- Navbar Superior -->
    <div class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">📅 EVENTOS USC</div>
        <div class="navbar-links">
          <router-link to="/eventos">Eventos</router-link>
          <router-link to="/mis-tickets">Mis Tickets</router-link>
          <router-link to="/perfil">Perfil</router-link>
        </div>
      </div>
    </div>

    <div class="detail-container" v-if="evento">
      <!-- Imagen del Evento -->
      <div class="event-image">
        <img :src="evento.imagen || 'https://via.placeholder.com/600x400'" :alt="evento.nombre" />
      </div>

      <!-- Información del Evento -->
      <div class="event-info">
        <h1>{{ evento.nombre }}</h1>

        <div class="info-grid">
          <div class="info-item">
            <strong>Fecha</strong>
            <p>{{ formatDateLong(evento.fecha) }}</p>
          </div>

          <div class="info-item">
            <strong>Hora</strong>
            <p>{{ evento.hora || '18:00 AM' }}</p>
          </div>

          <div class="info-item">
            <strong>Ubicación</strong>
            <p>{{ evento.ubicacion }}</p>
          </div>

          <div class="info-item">
            <strong>Categoría</strong>
            <p>{{ evento.categoria }}</p>
          </div>

          <div class="info-item">
            <strong>Organizador</strong>
            <p>{{ evento.organizador || 'Facultad de Ingeniería' }}</p>
          </div>

          <div class="info-item">
            <strong>Precio</strong>
            <p class="price">{{ formatPrice(evento.precio) }}</p>
          </div>
        </div>

        <div class="description-section">
          <h2>Descripción</h2>
          <p>{{ evento.descripcion || 'Sin descripción disponible' }}</p>
        </div>

        <button @click="handleInscribirse" class="btn-inscribirse" :disabled="inscribiendo">
          {{ inscribiendo ? 'Inscribiendo...' : 'Inscribirse' }}
        </button>

        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import eventoService from '../../services/eventoService';
import inscripcionService from '../../services/inscripcionService';
import authService from '../../services/authService';

const route = useRoute();
const router = useRouter();

const evento = ref(null);
const inscribiendo = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const loadEvento = async () => {
  try {
    const data = await eventoService.getById(route.params.id);
    evento.value = data.evento || data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleInscribirse = async () => {
  if (!authService.isAuthenticated()) {
    router.push('/login');
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';
  inscribiendo.value = true;

  try {
    const user = authService.getCurrentUser();
    await inscripcionService.create({
      usuario_id: user.id,
      evento_id: evento.value.id
    });

    successMessage.value = '¡Inscripción exitosa!';
    
    setTimeout(() => {
      router.push('/mis-tickets');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.response?.data?.mensaje || 'Error al inscribirse';
  } finally {
    inscribiendo.value = false;
  }
};

const formatDateLong = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatPrice = (price) => {
  return price === 0 || !price ? 'Gratis' : `$${price.toLocaleString()}`;
};

onMounted(() => {
  loadEvento();
});
</script>

<style scoped>
.event-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

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
}

.detail-container {
  max-width: 1000px;
  margin: 2rem auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.event-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.event-info {
  padding: 2.5rem;
}

.event-info h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.info-item strong {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}

.info-item p {
  color: #333;
  font-size: 1rem;
}

.info-item .price {
  font-size: 1.3rem;
  color: #2196F3;
  font-weight: 700;
}

.description-section {
  margin-bottom: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.description-section h2 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
}

.description-section p {
  color: #666;
  line-height: 1.7;
}

.btn-inscribirse {
  width: 100%;
  padding: 1.2rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-inscribirse:hover:not(:disabled) {
  background: #1976D2;
}

.btn-inscribirse:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 6px;
  text-align: center;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 6px;
  text-align: center;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .event-info {
    padding: 1.5rem;
  }

  .navbar-links {
    display: none;
  }
}
</style>