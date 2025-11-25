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
          <div>
            <button @click="goBack" class="btn-back">← Volver</button>
            <h1>Editar Evento</h1>
          </div>
        </div>

        <div v-if="loadingEvento" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando evento...</p>
        </div>

        <div v-else class="form-container">
          <form @submit.prevent="handleSubmit">
            <div class="form-grid">
              <!-- Información Básica -->
              <div class="form-group full-width">
                <h3 class="section-title">Información Básica</h3>
              </div>

              <div class="form-group">
                <label for="titulo">Título del evento *</label>
                <input
                  type="text"
                  id="titulo"
                  v-model="form.titulo"
                  placeholder="Ej: Conferencia de Tecnología"
                  required
                />
              </div>

              <div class="form-group">
                <label for="tipo_evento">Tipo de evento *</label>
                <select id="tipo_evento" v-model="form.tipo_evento" required>
                  <option value="">Seleccionar tipo</option>
                  <option value="CONFERENCIA">Conferencia</option>
                  <option value="TALLER">Taller</option>
                  <option value="SEMINARIO">Seminario</option>
                  <option value="CONGRESO">Congreso</option>
                  <option value="WEBINAR">Webinar</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="descripcion">Descripción *</label>
                <textarea
                  id="descripcion"
                  v-model="form.descripcion"
                  placeholder="Describe el evento..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <!-- Ubicación -->
              <div class="form-group full-width">
                <h3 class="section-title">Ubicación</h3>
              </div>

              <div class="form-group">
                <label for="lugar">Lugar *</label>
                <input
                  type="text"
                  id="lugar"
                  v-model="form.lugar"
                  placeholder="Ej: Auditorio Principal"
                  required
                />
              </div>

              <div class="form-group">
                <label for="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  v-model="form.direccion"
                  placeholder="Dirección completa"
                />
              </div>

              <!-- Fechas -->
              <div class="form-group full-width">
                <h3 class="section-title">Fechas</h3>
              </div>

              <div class="form-group">
                <label for="fecha_inicio">Fecha de inicio *</label>
                <input
                  type="datetime-local"
                  id="fecha_inicio"
                  v-model="form.fecha_inicio"
                  required
                />
              </div>

              <div class="form-group">
                <label for="fecha_fin">Fecha de fin *</label>
                <input
                  type="datetime-local"
                  id="fecha_fin"
                  v-model="form.fecha_fin"
                  required
                />
              </div>

              <div class="form-group">
                <label for="inicio_inscripcion">Inicio de inscripciones *</label>
                <input
                  type="datetime-local"
                  id="inicio_inscripcion"
                  v-model="form.inicio_inscripcion"
                  required
                />
              </div>

              <div class="form-group">
                <label for="fin_inscripcion">Fin de inscripciones *</label>
                <input
                  type="datetime-local"
                  id="fin_inscripcion"
                  v-model="form.fin_inscripcion"
                  required
                />
              </div>

              <!-- Capacidad y Pago -->
              <div class="form-group full-width">
                <h3 class="section-title">Capacidad y Pago</h3>
              </div>

              <div class="form-group">
                <label for="capacidad">Capacidad total *</label>
                <input
                  type="number"
                  id="capacidad"
                  v-model="form.capacidad"
                  placeholder="Número máximo de asistentes"
                  min="1"
                  required
                />
              </div>

              <div class="form-group">
                <label for="cupos_disponibles">Cupos disponibles *</label>
                <input
                  type="number"
                  id="cupos_disponibles"
                  v-model="form.cupos_disponibles"
                  placeholder="Cupos actuales"
                  min="0"
                  required
                />
              </div>

              <div class="form-group">
                <label for="tipo_pago">Tipo de pago *</label>
                <select id="tipo_pago" v-model="form.tipo_pago" required @change="handleTipoPagoChange">
                  <option value="">Seleccionar tipo</option>
                  <option value="GRATUITO">Gratuito</option>
                  <option value="PAGO">De pago</option>
                </select>
              </div>

              <div class="form-group" v-if="form.tipo_pago === 'PAGO'">
                <label for="precio">Precio *</label>
                <input
                  type="number"
                  id="precio"
                  v-model="form.precio"
                  placeholder="Precio del evento"
                  min="0"
                  step="0.01"
                  :required="form.tipo_pago === 'PAGO'"
                />
              </div>

              <!-- Imagen -->
              <div class="form-group full-width">
                <h3 class="section-title">Imagen</h3>
              </div>

              <div class="form-group full-width">
                <label for="url_imagen">URL de la imagen</label>
                <input
                  type="url"
                  id="url_imagen"
                  v-model="form.url_imagen"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <small class="form-help">Opcional: URL de una imagen representativa del evento</small>
              </div>

              <!-- Estado -->
              <div class="form-group">
                <label for="activo">Estado del evento *</label>
                <select id="activo" v-model="form.activo" required>
                  <option :value="true">Activo</option>
                  <option :value="false">Inactivo</option>
                </select>
              </div>
            </div>

            <div v-if="message" class="message" :class="messageType">
              {{ message }}
            </div>

            <div class="form-actions">
              <button type="button" @click="confirmDelete" class="btn-delete">
                Eliminar Evento
              </button>
              <div class="actions-right">
                <button type="button" @click="goBack" class="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" class="btn-submit" :disabled="loading">
                  {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <h3>¿Eliminar evento?</h3>
        <p>Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este evento?</p>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn-modal-cancel">
            Cancelar
          </button>
          <button @click="deleteEvento" class="btn-modal-delete" :disabled="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '@/services/authService';
import eventoService from '@/services/eventoService';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const loadingEvento = ref(true);
const deleting = ref(false);
const message = ref('');
const messageType = ref('');
const showDeleteModal = ref(false);

const form = ref({
  titulo: '',
  descripcion: '',
  tipo_evento: '',
  tipo_pago: '',
  precio: 0,
  lugar: '',
  direccion: '',
  fecha_inicio: '',
  fecha_fin: '',
  inicio_inscripcion: '',
  fin_inscripcion: '',
  capacidad: '',
  cupos_disponibles: '',
  url_imagen: '',
  activo: true
});

const formatDateTimeLocal = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const loadEvento = async () => {
  loadingEvento.value = true;
  try {
    const eventoId = route.params.id;
    const evento = await eventoService.getById(eventoId);
    
    // Llenar el formulario con los datos del evento
    form.value = {
      titulo: evento.titulo || '',
      descripcion: evento.descripcion || '',
      tipo_evento: evento.tipo_evento || '',
      tipo_pago: evento.tipo_pago || '',
      precio: evento.precio || 0,
      lugar: evento.lugar || '',
      direccion: evento.direccion || '',
      fecha_inicio: formatDateTimeLocal(evento.fecha_inicio),
      fecha_fin: formatDateTimeLocal(evento.fecha_fin),
      inicio_inscripcion: formatDateTimeLocal(evento.inicio_inscripcion),
      fin_inscripcion: formatDateTimeLocal(evento.fin_inscripcion),
      capacidad: evento.capacidad || '',
      cupos_disponibles: evento.cupos_disponibles || '',
      url_imagen: evento.url_imagen || '',
      activo: evento.activo !== undefined ? evento.activo : true
    };
  } catch (error) {
    console.error('Error al cargar evento:', error);
    message.value = 'Error al cargar el evento';
    messageType.value = 'error';
  } finally {
    loadingEvento.value = false;
  }
};

const handleTipoPagoChange = () => {
  if (form.value.tipo_pago === 'GRATUITO') {
    form.value.precio = 0;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  message.value = '';

  try {
    const eventoId = route.params.id;
    
    // Preparar datos para enviar
    const eventoData = {
      ...form.value,
      capacidad: Number(form.value.capacidad),
      cupos_disponibles: Number(form.value.cupos_disponibles),
      precio: form.value.tipo_pago === 'GRATUITO' ? 0 : Number(form.value.precio)
    };

    await eventoService.update(eventoId, eventoData);
    message.value = 'Evento actualizado exitosamente';
    messageType.value = 'success';
    
    setTimeout(() => {
      router.push('/admin/eventos');
    }, 1500);
  } catch (error) {
    console.error('Error:', error);
    message.value = error.response?.data?.mensaje || 'Error al actualizar el evento';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const deleteEvento = async () => {
  deleting.value = true;
  try {
    const eventoId = route.params.id;
    await eventoService.delete(eventoId);
    message.value = 'Evento eliminado exitosamente';
    messageType.value = 'success';
    
    setTimeout(() => {
      router.push('/admin/eventos');
    }, 1000);
  } catch (error) {
    console.error('Error:', error);
    message.value = error.response?.data?.mensaje || 'Error al eliminar el evento';
    messageType.value = 'error';
    showDeleteModal.value = false;
  } finally {
    deleting.value = false;
  }
};

const goBack = () => {
  router.push('/admin/eventos');
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

onMounted(() => {
  loadEvento();
});
</script>

<style scoped>
/* Mismo CSS que AdminCrearEventoView */
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
  max-width: 1200px;
}

.header {
  margin-bottom: 2rem;
}

.btn-back {
  background: none;
  border: none;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back:hover {
  color: #2196F3;
}

.header h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #2196F3;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.1rem;
  color: #2196F3;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e3f2fd;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2196F3;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-help {
  font-size: 0.8rem;
  color: #999;
  font-style: italic;
}

.message {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-right {
  display: flex;
  gap: 1rem;
}

.btn-cancel,
.btn-submit,
.btn-delete {
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e5e5e5;
}

.btn-submit {
  background: #333;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #555;
}

.btn-submit:disabled {
  background: #999;
  cursor: not-allowed;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.modal-content p {
  margin: 0 0 2rem 0;
  color: #666;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-modal-cancel,
.btn-modal-delete {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-modal-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-modal-cancel:hover {
  background: #e5e5e5;
}

.btn-modal-delete {
  background: #dc3545;
  color: white;
}

.btn-modal-delete:hover:not(:disabled) {
  background: #c82333;
}

.btn-modal-delete:disabled {
  background: #999;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .admin-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 1.5rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .actions-right {
    width: 100%;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit,
  .btn-delete {
    width: 100%;
  }
}
</style>