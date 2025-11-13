const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

async function registrar({ nombre, correo, contraseña, facultad }) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(contraseña, salt);
  const usuario = await prisma.usuario.create({
    data: { nombre, correo, contraseña: hash, facultad }
  });
  return usuario;
}

async function login({ correo, contraseña }) {
  const usuario = await prisma.usuario.findUnique({ where: { correo } });
  if (!usuario) throw new Error('Usuario no encontrado');
  const isValid = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!isValid) throw new Error('Credenciales inválidas');
  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: '8h' });
  return { usuario, token };
}

module.exports = { registrar, login };
