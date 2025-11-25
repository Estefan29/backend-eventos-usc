import express from "express";
import { registrarUsuario, loginUsuario } from "../controllers/auth.controller.js";
import { registroSchema, loginSchema } from "../validations/usuario.schema.js";

const router = express.Router();

router.post("/registro", registroSchema, registrarUsuario);
router.post("/login", loginSchema, loginUsuario);

export default router;