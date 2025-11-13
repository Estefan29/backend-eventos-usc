const prisma = require('../config/db');

async function crearEvento(data) {
  return prisma.evento.create({ data });
}

async function listarEventos() {
  return prisma.evento.findMany({
    where: { estado: 'PUBLICADO' },
    orderBy: { fecha: 'asc' }
  });
}

async function obtenerEvento(id) {
  return prisma.evento.findUnique({ where: { id: Number(id) } });
}

module.exports = { crearEvento, listarEventos, obtenerEvento };
