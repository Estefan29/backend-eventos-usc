<template>
  <div class="event-card" @click="goToDetail">
    <div class="event-image">
      <img :src="evento.imagen || '/placeholder-event.jpg'" :alt="evento.nombre" />
    </div>
    <div class="event-content">
      <h3>{{ evento.nombre }}</h3>
      <p class="event-date">📅 {{ formatDate(evento.fecha) }}</p>
      <p class="event-location">📍 {{ evento.ubicacion }}</p>
      <p class="event-category">🏷️ {{ evento.categoria }}</p>
      <div class="event-footer">
        <span class="event-price">{{ formatPrice(evento.precio) }}</span>
        <button class="btn-ver-mas">Ver más</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  evento: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const goToDetail = () => {
  router.push(`/eventos/${props.evento.id}`);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatPrice = (price) => {
  return price === 0 ? 'Gratis' : `$${price.toLocaleString()}`;
};
</script>

<style scoped>
.event-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.event-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-content {
  padding: 1.5rem;
}

.event-content h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

.event-date,
.event-location,
.event-category {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.event-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
}

.btn-ver-mas {
  padding: 0.5rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-ver-mas:hover {
  background: #5568d3;
}
</style>