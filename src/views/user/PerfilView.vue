<template>
  <div class="perfil-page">
    <Navbar />

    <div class="perfil-container">
      <h1 class="page-title">Mi Perfil</h1>

      <div class="perfil-card">
        <!-- Avatar -->
        <div class="avatar-section">
          <div class="avatar-circle">
            <div class="avatar-inner">
              {{ getInitials() }}
            </div>
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ user?.nombre || 'Usuario' }}</h2>
            <p class="user-role">USUARIO</p>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleUpdateProfile" class="perfil-form">
          <div class="form-group">
            <label for="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              v-model="editForm.nombre"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              v-model="editForm.email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="editForm.password"
              placeholder="Nueva contraseña (opcional)"
            />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              v-model="editForm.telefono"
              placeholder="Tu número de teléfono"
            />
          </div>

          <div v-if="message" class="message" :class="messageType">
            {{ message }}
          </div>

          <div class="form-actions">
            <button type="button" @click="handleCancel" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save" :disabled="loading">
              {{ loading ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import authService from '@/services/authService';
import usuarioService from '@/services/usuarioService';

const router = useRouter();
const user = ref(authService.getCurrentUser());
const loading = ref(false);
const message = ref('');
const messageType = ref('');

const editForm = ref({
  nombre: user.value?.nombre || '',
  email: user.value?.email || '',
  password: '',
  telefono: user.value?.telefono || ''
});

const getInitials = () => {
  const nombre = user.value?.nombre || 'Usuario';
  const words = nombre.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

const handleUpdateProfile = async () => {
  message.value = '';
  loading.value = true;

  try {
    const updateData = {
      nombre: editForm.value.nombre,
      email: editForm.value.email,
      telefono: editForm.value.telefono
    };

    if (editForm.value.password) {
      updateData.password = editForm.value.password;
    }

    await usuarioService.update(user.value.id, updateData);

    const updatedUser = { ...user.value, ...updateData };
    delete updatedUser.password;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    user.value = updatedUser;

    message.value = 'Perfil actualizado correctamente';
    messageType.value = 'success';

    setTimeout(() => {
      message.value = '';
    }, 3000);
  } catch (error) {
    message.value = error.response?.data?.mensaje || 'Error al actualizar perfil';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  editForm.value = {
    nombre: user.value?.nombre || '',
    email: user.value?.email || '',
    password: '',
    telefono: user.value?.telefono || ''
  };
  message.value = '';
};

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login');
  }
});
</script>

<style scoped>
.perfil-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.perfil-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2rem;
}

.perfil-card {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e5e5;
}

.avatar-circle {
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-inner {
  width: 100px;
  height: 100px;
  background: #1976d2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.user-role {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin: 0;
}

.perfil-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e5e5e5;
}

.btn-save {
  background-color: #2196f3;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background-color: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.btn-save:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .perfil-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .perfil-card {
    padding: 1.5rem;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .avatar-circle {
    width: 120px;
    height: 120px;
  }

  .avatar-inner {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }

  .user-name {
    font-size: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}
</style>