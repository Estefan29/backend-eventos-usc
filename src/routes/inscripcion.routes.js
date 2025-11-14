import { Router } from "express";
import {
  crearInscripcion,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  cancelarInscripcion
} from "../controllers/inscripcion.controller.js";

import auth from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { inscripcionSchema } from "../validations/inscripcion.schema.js";

const router = Router();

// Crear inscripción con validación
router.post("/", auth, validateSchema(inscripcionSchema), crearInscripcion);

// Listar inscripciones
router.get("/", auth, obtenerInscripciones);

// Obtener inscripción por ID
router.get("/:id", auth, obtenerInscripcionPorId);

// Cancelar inscripción
router.put("/:id/cancelar", auth, cancelarInscripcion);

export default router;
