<template>
  <div class="admin-page">
    <!-- Navbar Admin -->
    <div class="navbar">
      <div class="navbar-brand">📅 EVENTOS USC</div>
    </div>

    <div class="admin-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <router-link to="/admin" class="menu-item active">
          <span class="icon">🏠</span>
          Panel de control
        </router-link>
        <router-link to="/admin/eventos" class="menu-item">
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

      <!-- Contenido Principal -->
      <div class="content">
        <h1>Panel de control</h1>

        <!-- Estadísticas -->
        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-label">Eventos activos</p>
            <p class="stat-value">{{ stats.eventosActivos }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Próximos eventos</p>
            <p class="stat-value">{{ stats.proximosEventos }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Eventos completados</p>
            <p class="stat-value">{{ stats.eventosCompletados }}</p>
          </div>
        </div>

        <!-- Resumen de eventos -->
        <div class="summary-section">
          <h2>Resumen de eventos</h2>
          <div class="charts-grid">
            <div class="chart-card">
              <h3>Asistencia a eventos</h3>
              <p class="percentage">+15%</p>
              <p class="sub-text">Este mes +15%</p>
              <div class="chart-placeholder">
                <svg viewBox="0 0 400 150" class="line-chart">
                  <polyline
                    points="0,100 50,80 100,90 150,60 200,120 250,50 300,70 350,40 400,60"
                    fill="none"
                    stroke="#2196F3"
                    stroke-width="2"
                  />
                </svg>
              </div>
            </div>

            <div class="chart-card">
              <h3>Ingresos totales</h3>
              <p class="percentage">+8%</p>
              <p class="sub-text">Este mes +8%</p>
              <div class="bar-chart">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 50%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 65%"></div>
                <div class="bar" style="height: 75%"></div>
              </div>
            </div>
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
import eventoService from '../../services/eventoService';

const router = useRouter();

const stats = ref({
  eventosActivos: 0,
  proximosEventos: 0,
  eventosCompletados: 0
});

const loadStats = async () => {
  try {
    const data = await eventoService.getAll();
    const eventos = data.eventos || data;
    
    stats.value.eventosActivos = eventos.length;
    stats.value.proximosEventos = eventos.filter(e => new Date(e.fecha) > new Date()).length;
    stats.value.eventosCompletados = eventos.filter(e => new Date(e.fecha) < new Date()).length;
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};

onMounted(() => {
  loadStats();
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.menu-item .icon {
  font-size: 1.1rem;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #333;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  color: #333;
  font-weight: 700;
}

.summary-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.chart-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-card h3 {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
}

.percentage {
  font-size: 2rem;
  color: #4caf50;
  font-weight: 700;
}

.sub-text {
  color: #999;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.line-chart {
  width: 100%;
  height: 120px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 120px;
}

.bar {
  flex: 1;
  background: #e0e0e0;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
}

.bar:hover {
  background: #2196F3;
}

@media (max-width: 968px) {
  .admin-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .stats-grid,
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>