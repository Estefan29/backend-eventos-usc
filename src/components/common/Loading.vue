<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Crea una Cuenta</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Nombre</label>
          <input
            v-model="formData.nombre"
            type="text"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="ejemplo@usc.edu.co"
            required
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input
            v-model="formData.contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div class="form-group">
          <label>Confirmar Contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Creando cuenta...' : 'Crear' }}
        </button>

        <p class="auth-footer">
          Ya tienes una cuenta? 
          <router-link to="/login">Inicia sesión</router-link>
        </p>
      </form>

      <div v-if="error" class="alert alert-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const formData = ref({
  nombre: '',
  email: '',
  contraseña: ''
});

const confirmPassword = ref('');

const handleSubmit = async () => {
  error.value = '';

  if (formData.value.contraseña !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  if (formData.value.contraseña.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  loading.value = true;

  try {
    await authService.register(formData.value);
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.mensaje || 'Error al crear la cuenta';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.auth-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  width: 100%;
}

.auth-container h1 {
  text-align: center;
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

.btn-submit {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.alert {
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
}

.alert-error {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}
</style>