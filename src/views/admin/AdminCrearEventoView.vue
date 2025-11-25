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
            <h1>Crear Nuevo Evento</h1>
          </div>
        </div>

        <div class="form-container">
          <form @submit.prevent="handleSubmit">
            <div class="form-grid">
              <div class="form-group">
                <label for="titulo">Nombre del evento *</label>
                <input
                  type="text"
                  id="titulo"
                  v-model="form.titulo"
                  placeholder="Ej: Conferencia de Tecnología"
                  required
                />
              </div>

              <div class="form-group">
                <label for="categoria">Categoría *</label>
                <select id="categoria" v-model="form.categoria" required>
                  <option value="">Seleccionar categoría</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Arte">Arte</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Música">Música</option>
                  <option value="Educación">Educación</option>
                  <option value="Negocios">Negocios</option>
                </select>
              </div>

              <div class="form-group">
                <label for="fecha_inicio">Fecha del evento *</label>
                <input
                  type="date"
                  id="fecha_inicio"
                  v-model="form.fecha_inicio"
                  required
                />
              </div>

              <div class="form-group">
                <label for="hora">Hora *</label>
                <input
                  type="time"
                  id="hora"
                  v-model="form.hora"
                  required
                />
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
                <label for="capacidad">Capacidad *</label>
                <input
                  type="number"
                  id="capacidad"
                  v-model="form.capacidad"
                  placeholder="Número de asistentes"
                  min="1"
                  required
                />
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

              <div class="form-group">
                <label for="precio">Precio</label>
                <input
                  type="number"
                  id="precio"
                  v-model="form.precio"
                  placeholder="0 para eventos gratuitos"
                  min="0"
                  step="0.01"
                />
              </div>

              <div class="form-group">
                <label for="imagen">URL de la imagen</label>
                <input
                  type="url"
                  id="imagen"
                  v-model="form.imagen"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div class="form-group">
                <label for="organizador">Organizador</label>
                <input
                  type="text"
                  id="organizador"
                  v-model="form.organizador"
                  placeholder="Nombre del organizador"
                />
              </div>

              <div class="form-group">
                <label for="estado">Estado *</label>
                <select id="estado" v-model="form.estado" required>
                  <option value="activo">Activo</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
            </div>

            <div v-if="message" class="message" :class="messageType">
              {{ message }}
            </div>

            <div class="form-actions">
              <button type="button" @click="goBack" class="btn-cancel">
                Cancelar
              </button>
              <button type="submit" class="btn-submit" :disabled="loading">
                {{ loading ? 'Creando...' : 'Crear Evento' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import eventoService from '@/services/eventoService';

const router = useRouter();
const loading = ref(false);
const message = ref('');
const messageType = ref('');

const form = ref({
  titulo: '',
  categoria: '',
  fecha_inicio: '',
  hora: '',
  lugar: '',
  capacidad: '',
  descripcion: '',
  precio: 0,
  imagen: '',
  organizador: '',
  estado: 'activo'
});

const handleSubmit = async () => {
  loading.value = true;
  message.value = '';

  try {
    await eventoService.create(form.value);
    message.value = 'Evento creado exitosamente';
    messageType.value = 'success';
    
    setTimeout(() => {
      router.push('/admin/eventos');
    }, 1500);
  } catch (error) {
    message.value = error.response?.data?.mensaje || 'Error al crear el evento';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/admin/eventos');
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
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

.form-container {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
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
}
</style>