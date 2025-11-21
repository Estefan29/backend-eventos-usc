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
        <router-link to="/admin/eventos" class="menu-item">
          <span class="icon">📅</span>
          Eventos
        </router-link>
        <router-link to="/admin/usuarios" class="menu-item active">
          <span class="icon">👥</span>
          Usuarios
        </router-link>
        <button @click="handleLogout" class="menu-item logout-btn">
          <span class="icon">🚪</span>
          Cerrar sesión
        </button>
      </div>

      <div class="content">
        <h1>Gestión de Usuarios</h1>

        <div class="usuarios-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span class="badge" :class="usuario.rol">
                    {{ usuario.rol === 'admin' ? 'Admin' : 'Usuario' }}
                  </span>
                </td>
                <td>
                  <button @click="eliminarUsuario(usuario.id)" class="btn-eliminar">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="usuarios.length === 0" class="empty-state">
            <p>No hay usuarios registrados</p>
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
import usuarioService from '../../services/usuarioService';

const router = useRouter();
const usuarios = ref([]);

const loadUsuarios = async () => {
  try {
    const data = await usuarioService.getAll();
    usuarios.value = data.usuarios || data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const eliminarUsuario = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

  try {
    await usuarioService.delete(id);
    usuarios.value = usuarios.value.filter(u => u.id !== id);
    alert('Usuario eliminado correctamente');
  } catch (error) {
    alert('Error al eliminar usuario');
  }
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

onMounted(() => {
  loadUsuarios();
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

.content h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.usuarios-table {
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

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.admin {
  background: #fff3cd;
  color: #856404;
}

.badge.usuario {
  background: #d1ecf1;
  color: #0c5460;
}

.btn-eliminar {
  padding: 0.6rem 1.2rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-eliminar:hover {
  background: #c82333;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}
</style>