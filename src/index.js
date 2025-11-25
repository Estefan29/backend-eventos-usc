import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import eventoRoutes from './routes/evento.routes.js';
import inscripcionRoutes from './routes/inscripcion.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import ticketRoutes from './routes/ticket.routes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    ok: true, 
    mensaje: '🎉 API USC Eventos funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      eventos: '/api/eventos',
      inscripciones: '/api/inscripciones',
      pagos: '/api/pagos',
      usuarios: '/api/usuarios',
      tickets: '/api/tickets'
    }
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tickets', ticketRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    ok: false, 
    mensaje: 'Ruta no encontrada',
    ruta: req.originalUrl 
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    ok: false,
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(`✨ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación API: http://localhost:${PORT}/`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════════');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});