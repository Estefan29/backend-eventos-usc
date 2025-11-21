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
        <h1>Crear nuevo evento</h1>

        <form @submit.prevent="handleSubmit" class="evento-form">
          <div class="form-group">
            <label>Nombre del evento</label>
            <input
              v-model="formData.nombre"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea
              v-model="formData.descripcion"
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Fecha y hora</label>
            <input
              v-model="formData.fecha"
              type="datetime-local"
              required
            />
          </div>

          <div class="form-group">
            <label>Lugar</label>
            <input
              v-model="formData.ubicacion"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label>Tipo de evento</label>
            <input
              v-model="formData.categoria"
              type="text"
              placeholder="Ej: Conferencia, Taller, Concierto"
              required
            />
          </div>

          <div class="form-group">
            <label>Precio (COP)</label>
            <input
              v-model.number="formData.precio"
              type="number"
              min="0"
              placeholder="0 para eventos gratuitos"
            />
          </div>

          <div class="form-group upload-section">
            <label>Cargar imagen</label>
            <div class="upload-box">
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                id="file-upload"
                hidden
              />
              <label for="file-upload" class="upload-label">
                <span v-if="!imagePreview">
                  Arrastra y suelta una imagen aquí o
                </span>
                <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="image-preview" />
              </label>
              <button type="button" @click="triggerFileInput" class="btn-seleccionar">
                Selecciona un archivo
              </button>
            </div>
          </div>

          <button type="submit" class="btn-crear-evento" :disabled="loading">
            {{ loading ? 'Creando...' : 'Crear Evento' }}
          </button>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/authService';
import eventoService from '../../services/eventoService';

const router = useRouter();
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const imagePreview = ref('');

const formData = ref({
  nombre: '',
  descripcion: '',
  fecha: '',
  ubicacion: '',
  categoria: '',
  precio: 0,
  imagen: ''
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
      formData.value.imagen = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const triggerFileInput = () => {
  document.getElementById('file-upload').click();
};

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    const eventoData = {
      nombre: formData.value.nombre,
      descripcion: formData.value.descripcion,
      fecha: formData.value.fecha,
      ubicacion: formData.value.ubicacion,
      categoria: formData.value.categoria,
      precio: formData.value.precio || 0,
      imagen: formData.value.imagen || null,
      destacado: false
    };

    await eventoService.create(eventoData);
    
    successMessage.value = '✓ Evento creado exitosamente';
    
    setTimeout(() => {
      router.push('/admin/eventos');
    }, 1500);
  } catch (error) {
    errorMessage.value = error.response?.data?.mensaje || 'Error al crear el evento';
  } finally {
    loading.value = false;
  }
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
  max-width: 800px;
}

.content h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.evento-form {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.8rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2196F3;
}

.upload-section {
  margin: 2rem 0;
}

.upload-box {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #fafafa;
}

.upload-label {
  display: block;
  cursor: pointer;
  color: #666;
  margin-bottom: 1rem;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.btn-seleccionar {
  padding: 0.7rem 1.5rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-seleccionar:hover {
  background: #e0e0e0;
}

.btn-crear-evento {
  width: 100%;
  padding: 1rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-crear-evento:hover:not(:disabled) {
  background: #1976D2;
}

.btn-crear-evento:disabled {
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

@media (max-width: 968px) {
  .admin-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .content {
    padding: 1.5rem;
  }

  .evento-form {
    padding: 1.5rem;
  }
}
</style>