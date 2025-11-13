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

router.post("/", auth, crearTicketController);
router.get("/", auth, obtenerTicketsController);
router.get("/:id", auth, obtenerTicketPorIdController);
router.put("/:id/validar", auth, validarTicketController);
router.delete("/:id", auth, eliminarTicketController);

export default router;
