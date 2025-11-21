<template>
  <div class="profile-page">
    <Navbar />

    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            {{ user?.nombre?.charAt(0).toUpperCase() }}
          </div>
          <h1>{{ user?.nombre }}</h1>
          <p class="email">{{ user?.email }}</p>
          <span class="role-badge" :class="user?.rol">
            {{ user?.rol === 'admin' ? '👑 Administrador' : '👤 Usuario' }}
          </span>
        </div>

        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-icon">🎫</span>
            <div>
              <p class="stat-value">{{ stats.totalTickets }}</p>
              <p class="stat-label">Tickets</p>
            </div>
          </div>

          <div class="stat-item">
            <span class="stat-icon">✅</span>
            <div>
              <p class="stat-value">{{ stats.eventosAsistidos }}</p>
              <p class="stat-label">Eventos Asistidos</p>
            </div>
          </div>

          <div class="stat-item">
            <span class="stat-icon">⏳</span>
            <div>
              <p class="stat-value">{{ stats.eventosPendientes }}</p>
              <p class="stat-label">Pendientes</p>
            </div>
          </div>
        </div>

        <div class="profile-actions">
          <button @click="showEditModal = true" class="btn-edit">
            ✏️ Editar Perfil
          </button>
          <button @click="handleLogout" class="btn-logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Actividad Reciente</h2>
        
        <Loading v-if="loadingActivity" message="Cargando actividad..." />

        <div v-else-if="recentTickets.length > 0" class="activity-list">
          <div
            v-for="ticket in recentTickets"
            :key="ticket.id"
            class="activity-item"
          >
            <div class="activity-icon">🎫</div>
            <div class="activity-content">
              <h3>{{ ticket.evento_nombre }}</h3>
              <p>{{ formatDate(ticket.fecha_emision) }}</p>
            </div>
            <span class="activity-status" :class="{ validated: ticket.validado }">
              {{ ticket.validado ? '✓ Validado' : '⏳ Pendiente' }}
            </span>
          </div>
        </div>

        <div v-else class="empty-activity">
          <p>No hay actividad reciente</p>
        </div>
      </div>
    </div>

    <!-- Modal Editar Perfil -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Editar Perfil</h2>

        <form @submit.prevent="handleUpdateProfile">
          <div class="form-group">
            <label>Nombre</label>
            <input
              v-model="editForm.nombre"
              type="text"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="editForm.email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Nueva Contraseña (opcional)</label>
            <input
              v-model="editForm.contraseña"
              type="password"
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save" :disabled="updating">
              {{ updating ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>

        <div v-if="updateMessage" class="alert" :class="updateSuccess ? 'alert-success' : 'alert-error'">
          {{ updateMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import Loading from '@/components/common/Loading.vue';
import authService from '@/services/authService';
import ticketService from '@/services/ticketService';
import usuarioService from '@/services/usuarioService';

const router = useRouter();

const user = ref(authService.getCurrentUser());
const loadingActivity = ref(true);
const recentTickets = ref([]);
const showEditModal = ref(false);
const updating = ref(false);
const updateMessage = ref('');
const updateSuccess = ref(false);

const stats = computed(() => {
  const total = recentTickets.value.length;
  const validados = recentTickets.value.filter(t => t.validado).length;
  return {
    totalTickets: total,
    eventosAsistidos: validados,
    eventosPendientes: total - validados
  };
});

const editForm = ref({
  nombre: user.value?.nombre || '',
  email: user.value?.email || '',
  contraseña: ''
});

const loadRecentActivity = async () => {
  loadingActivity.value = true;
  try {
    const data = await ticketService.getAll();
    recentTickets.value = (data.tickets || data).slice(0, 5);
  } catch (error) {
    console.error('Error cargando actividad:', error);
  } finally {
    loadingActivity.value = false;
  }
};

const handleUpdateProfile = async () => {
  updateMessage.value = '';
  updating.value = true;

  try {
    const updateData = {
      nombre: editForm.value.nombre,
      email: editForm.value.email
    };

    if (editForm.value.contraseña) {
      updateData.contraseña = editForm.value.contraseña;
    }

    await usuarioService.update(user.value.id, updateData);

    const updatedUser = { ...user.value, ...updateData };
    delete updatedUser.contraseña;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    user.value = updatedUser;

    updateMessage.value = '✓ Perfil actualizado correctamente';
    updateSuccess.value = true;

    setTimeout(() => {
      showEditModal.value = false;
      updateMessage.value = '';
    }, 2000);
  } catch (error) {
    updateMessage.value = error.response?.data?.mensaje || 'Error al actualizar perfil';
    updateSuccess.value = false;
  } finally {
    updating.value = false;
  }
};

const closeModal = () => {
  showEditModal.value = false;
  updateMessage.value = '';
  editForm.value.contraseña = '';
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
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
  loadRecentActivity();
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 3rem;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  height: fit-content;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 800;
  margin: 0 auto 1rem;
}

.profile-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.email {
  color: #666;
  margin-bottom: 1rem;
}

.role-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.role-badge.admin {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
}

.profile-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 2rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
  margin: 0;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-edit,
.btn-logout {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-logout {
  background: #f5f5f5;
  color: #666;
}

.btn-logout:hover {
  background: #e0e0e0;
}

.recent-activity {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.recent-activity h2 {
  margin-bottom: 2rem;
  color: #333;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 15px;
  transition: all 0.3s;
}

.activity-item:hover {
  background: #f0f0f0;
  transform: translateX(5px);
}

.activity-icon {
  font-size: 2rem;
}

.activity-content {
  flex: 1;
}

.activity-content h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.activity-content p {
  color: #999;
  font-size: 0.9rem;
  margin: 0;
}

.activity-status {
  padding: 0.5rem 1rem;
  background: #ffc107;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.activity-status.validated {
  background: #28a745;
}

.empty-activity {
  text-align: center;
  padding: 3rem;
  color: #999;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  text-align: center;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

@media (max-width: 968px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}
</style>