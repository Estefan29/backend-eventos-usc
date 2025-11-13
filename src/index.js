import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import eventoRoutes from './routes/evento.routes.js';
import inscripcionRoutes from './routes/inscripcion.routes.js';
import pagoRoutes from './routes/pago.routes.js'
import usuarioRoutes from './routes/usuario.routes.js';
import ticketRoutes from "./routes/ticket.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use("/api/tickets", ticketRoutes);

// Rutas (por ahora, solo una de prueba)
app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API USC Eventos funcionando correctamente 🎉' });
});

// Servidor
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
