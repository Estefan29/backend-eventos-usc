import { Router } from "express";
import {
  crearTicketController,
  obtenerTicketsController,
  obtenerTicketPorIdController,
  validarTicketController,
  eliminarTicketController,
} from "../controllers/ticket.controller.js";
import auth from "../middlewares/authMiddleware.js";

const router = Router();

// Crear ticket (normalmente tras confirmarse una inscripción pagada)
router.post("/", auth, crearTicket);

//Listar todos los tickets (solo admin)
router.get("/", auth, obtenerTickets);

//Obtener ticket por ID
router.get("/:id", auth, obtenerTicketPorId);

//  Validar ticket (marcar como usado)
router.put("/:id/validar", auth, validarTicket);

// Eliminar ticket (opcional)
router.delete("/:id", auth, eliminarTicket);

export default router;
