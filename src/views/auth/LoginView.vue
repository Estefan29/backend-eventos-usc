<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Bienvenido</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Correo institucional</label>
          <input v-model="formData.correo" type="email" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="formData.contrasena" type="password" required />
        </div>

        <router-link to="/recuperar-contrasena" class="forgot-link">
          ¿Olvidaste tu contraseña?
        </router-link>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Iniciando...' : 'Iniciar sesión' }}
        </button>

        <p class="footer-text">
          ¿No tienes una cuenta? <router-link to="/registro">Regístrate</router-link>
        </p>
      </form>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../../services/authService';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const formData = ref({
  correo: '',
  contrasena: ''
});

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const response = await authService.login(formData.value);
    
    // Redirigir según el rol
    if (response.usuario.rol === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/eventos');
    }
  } catch (err) {
    error.value = err.response?.data?.mensaje || 'Credenciales incorrectas';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Mantén los estilos anteriores */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 2rem;
}

.login-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  max-width: 450px;
  width: 100%;
}

.login-card h1 {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.95rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #2196F3;
}

.form-group input::placeholder {
  color: #999;
}

.forgot-link {
  display: block;
  text-align: center;
  color: #2196F3;
  text-decoration: none;
  font-size: 0.9rem;
  margin: 1rem 0;
}

.btn-login {
  width: 100%;
  padding: 0.9rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  background: #1976D2;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.footer-text a {
  color: #2196F3;
  text-decoration: none;
  font-weight: 500;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}
</style>
 