<template>
  <div class="admin-page">
    <div class="navbar">
      <div class="navbar-brand">📅 EVENTOS USC</div>
    </div>

    <div class="admin-container">
      <div class="sidebar">
        <router-link to="/admin" class="menu-item">
          <span class="icon">🏠</span>
          Panel de Control
        </router-link>
        <router-link to="/admin/eventos" class="menu-item active">
          <span class="icon">📅</span>
          Eventos
        </router-link>
        <router-link to="/admin/usuarios" class="menu-item">
          <span class="icon">👥</span>
          Usuarios
        </router-link>
        <button @click="handleLogout" class="menu-item logout-btn">
          <span class="icon">🚪</span>
          Cerrar sesión
        </button>
      </div>

      <div class="content">
        <div class="header">
          <h1>Gestión de Eventos</h1>
          <router-link to="/admin/eventos/crear" class="btn-crear">
            + Crear evento
          </router-link>
        </div>

        <div class="eventos-table">
          <table>
            <thead>
              <tr>
                <th>Nombre del evento</th>
                <th>Fecha</th>
                <th>Lugar</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="evento in eventos" :key="evento.id">
               <td>{{ evento.titulo }}</td>
<td>{{ formatDate(evento.fecha_inicio) }}</td>
<td>{{ evento.lugar }}</td>

                <td>
                  <button @click="editarEvento(evento.id)" class="btn-editar">
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="eventos.length === 0" class="empty-state">
            <p>No hay eventos registrados</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/authService';
import eventoService from '../../services/eventoService';

const router = useRouter();
const eventos = ref([]);

const loadEventos = async () => {
  try {
    const data = await eventoService.getAll();
    eventos.value = data.eventos || data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const editarEvento = (id) => {
  router.push(`/admin/eventos/editar/${id}`);
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

onMounted(() => {
  loadEventos();
});
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: #2196F3;
  padding: 1rem 2rem;
}

.navbar-brand {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
}

.admin-container {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: calc(100vh - 60px);
}

.sidebar {
  background: white;
  padding: 1rem 0;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.5rem;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  background: none;
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.active {
  background: #e3f2fd;
  color: #2196F3;
  border-right: 3px solid #2196F3;
}

.logout-btn {
  margin-top: auto;
}

.content {
  padding: 2.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #333;
}

.btn-crear {
  padding: 0.8rem 1.5rem;
  background: #333;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-crear:hover {
  background: #555;
}

.eventos-table {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  padding: 1rem;
  color: #666;
  font-weight: 600;
  border-bottom: 2px solid #f0f0f0;
}

tbody td {
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.btn-editar {
  padding: 0.6rem 1.2rem;
  background: #333;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-editar:hover {
  background: #555;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}
</style>