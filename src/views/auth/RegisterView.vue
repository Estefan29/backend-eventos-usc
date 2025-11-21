<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Crea una Cuenta</h1>

      <form @submit.prevent="handleRegister">
        
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="formData.nombre" type="text" required />
        </div>

        <div class="form-group">
          <label>Apellido</label>
          <input v-model="formData.apellido" type="text" required />
        </div>

        <div class="form-group">
          <label>Correo</label>
          <input v-model="formData.correo" type="email" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="formData.contrasena" type="password" required />

        </div>

        <div class="form-group">
          <label>Confirmar Contraseña</label>
          <input v-model="confirmPassword" type="password" required />
        </div>

        <div class="form-group">
          <label>Rol</label>
          <select v-model="formData.rol" required>
  <option value="USUARIO">Usuario</option>
  <option value="ADMIN">Administrador</option>
</select>

        </div>

        <div class="form-group">
          <label>Tipo de usuario</label>
          <select v-model="formData.tipo_usuario" required>
  <option value="ESTUDIANTE">Estudiante</option>
  <option value="PROFESOR">Profesor</option>
</select>

        </div>

        <button type="submit" class="btn-crear" :disabled="loading">
          {{ loading ? 'Creando...' : 'Crear' }}
        </button>

        <p class="footer-text">
          ¿Ya tienes una cuenta? <router-link to="/login">Inicia sesión</router-link>
        </p>
      </form>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../../services/authService";

const router = useRouter();
const loading = ref(false);
const error = ref("");

const formData = ref({
  nombre: "",
  apellido: "",
  correo: "",
  contrasena: "",         // ⬅ CAMBIADO
  rol: "USUARIO",         // ⬅ CAMBIADO (solo USUARIO o ADMIN)
  tipo_usuario: "ESTUDIANTE" // ⬅ CAMBIADO
});

const confirmPassword = ref("");

const handleRegister = async () => {
  error.value = "";

  if (formData.value.contrasena !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden";
    return;
  }

  loading.value = true;

  try {
    await authService.register(formData.value);
    alert("Cuenta creada exitosamente");
    router.push("/login");
  } catch (err) {
    error.value = err.response?.data?.mensaje || "Error al crear la cuenta";
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 2rem;
}

.register-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  max-width: 450px;
  width: 100%;
}

.register-card h1 {
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

.btn-crear {
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

.btn-crear:hover:not(:disabled) {
  background: #1976D2;
}

.btn-crear:disabled {
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

@media (max-width: 500px) {
  .register-card {
    padding: 2rem 1.5rem;
  }
}
</style>