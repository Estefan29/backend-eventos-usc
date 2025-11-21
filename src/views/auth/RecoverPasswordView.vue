<template>
  <div class="recover-page">
    <div class="recover-card">
      <h1>Recuperar contraseña</h1>

      <form @submit.prevent="handleRecover">
        <div class="form-group">
          <label>Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            required
          />
        </div>

        <div class="button-group">
          <button type="button" @click="goBack" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-continue" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Continuar' }}
          </button>
        </div>

        <p class="info-text">
          Se te va a enviar un enlace de recuperación de contraseña a tu correo
        </p>
      </form>

      <div v-if="success" class="success-message">{{ success }}</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const success = ref('');
const email = ref('');

const handleRecover = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    success.value = 'Enlace enviado correctamente';
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = 'Error al enviar el correo';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/login');
};
</script>

<style scoped>
.recover-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 2rem;
}

.recover-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  max-width: 450px;
  width: 100%;
}

.recover-card h1 {
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

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-continue {
  padding: 0.9rem;
  border: none;
  border-radius: 6px;
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

.btn-continue {
  background: #2196F3;
  color: white;
}

.btn-continue:hover:not(:disabled) {
  background: #1976D2;
}

.btn-continue:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #999;
  font-size: 0.85rem;
  line-height: 1.4;
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
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

@media (max-width: 500px) {
  .recover-card {
    padding: 2rem 1.5rem;
  }

  .button-group {
    grid-template-columns: 1fr;
  }
}
</style>