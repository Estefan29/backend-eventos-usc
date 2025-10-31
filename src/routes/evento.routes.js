const express = require('express');
const router = express.Router();
const eventoService = require('../services/eventoService');
const auth = require('../middlewares/authMiddleware');

// Crear evento (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.rol !== 'ADMIN') return res.status(403).json({ error: 'No autorizado' });
  try {
    const ev = await eventoService.crearEvento({ ...req.body, creadorId: req.user.id });
    res.status(201).json(ev);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.get('/', async (req, res) => {
  const list = await eventoService.listarEventos();
  res.json(list);
});

router.get('/:id', async (req, res) => {
  const ev = await eventoService.obtenerEvento(req.params.id);
  res.json(ev);
});

module.exports = router;
