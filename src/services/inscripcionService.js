const prisma = require('../config/db');
const QRCode = require('qrcode');

async function inscribir(usuarioId, eventoId) {
  // validar cupo
  const evento = await prisma.evento.findUnique({ where: { id: Number(eventoId) } });
  const inscritos = await prisma.inscripcion.count({ where: { eventoId: Number(eventoId) } });
  if (inscritos >= evento.cupo) throw new Error('Cupo agotado');

  const ins = await prisma.inscripcion.create({
    data: { usuarioId: Number(usuarioId), eventoId: Number(eventoId), estadoPago: evento.esPago ? 'PENDIENTE' : 'APROBADO' }
  });

  // generar QR (texto con id de inscripcion) y guardarlo
  const qrData = `inscripcion:${ins.id}`;
  const qrImg = await QRCode.toDataURL(qrData);
  await prisma.inscripcion.update({ where: { id: ins.id }, data: { ticketQR: qrImg }});

  return { inscripcion: ins, qr: qrImg, evento };
}

module.exports = { inscribir };
