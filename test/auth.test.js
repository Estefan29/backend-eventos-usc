import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth.routes.js';

// Crear app de prueba
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Autenticación - Tests', () => {
  
  describe('POST /api/auth/registro', () => {
    
    it('Debe registrar un nuevo usuario correctamente', async () => {
      const nuevoUsuario = {
        correo: `test${Date.now()}@usc.edu.co`,
        contrasena: 'Password123!',
        nombre: 'Test',
        apellido: 'Usuario',
        rol: 'USUARIO',
        tipo_usuario: 'ESTUDIANTE'
      };

      const response = await request(app)
        .post('/api/auth/registro')
        .send(nuevoUsuario)
        .expect(201);

      expect(response.body).toHaveProperty('mensaje');
      expect(response.body.mensaje).toBe('Usuario registrado exitosamente');
      expect(response.body.usuario).toHaveProperty('id');
    });

    it('Debe fallar si faltan datos obligatorios', async () => {
      const usuarioIncompleto = {
        correo: 'test@usc.edu.co',
        nombre: 'Test'
      };

      const response = await request(app)
        .post('/api/auth/registro')
        .send(usuarioIncompleto)
        .expect(400);

      expect(response.body.mensaje).toBe('Faltan datos obligatorios');
    });
  });

  describe('POST /api/auth/login', () => {
    
    const usuarioPrueba = {
      correo: `login${Date.now()}@usc.edu.co`,
      contrasena: 'Password123!',
      nombre: 'Login',
      apellido: 'Test',
      rol: 'USUARIO',
      tipo_usuario: 'ESTUDIANTE'
    };

    beforeAll(async () => {
      await request(app).post('/api/auth/registro').send(usuarioPrueba);
    });

    it('Debe hacer login correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          correo: usuarioPrueba.correo,
          contrasena: usuarioPrueba.contrasena
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.mensaje).toBe('Inicio de sesión exitoso');
    });

    it('Debe fallar con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          correo: usuarioPrueba.correo,
          contrasena: 'ContraseñaIncorrecta'
        })
        .expect(401);

      expect(response.body.mensaje).toBe('Contraseña incorrecta');
    });
  });
});