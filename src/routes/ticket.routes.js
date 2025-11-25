
import { Router } from "express";
import {
  crearTicketController,
  obtenerTicketsController,
  obtenerTicketPorIdController,
  validarTicketController,
  eliminarTicketController,
} from "../controllers/ticket.controller.js";
import auth from "../middlewares/authMiddleware.js";
import { esAdministrador } from "../middlewares/rolesMiddleware.js";

const router = Router();

router.post("/", auth, crearTicketController);
router.get("/", auth, obtenerTicketsController);
router.get("/:id", auth, obtenerTicketPorIdController);
router.put("/:id/validar", auth, esAdministrador, validarTicketController);
router.delete("/:id", auth, esAdministrador, eliminarTicketController);

export default router;