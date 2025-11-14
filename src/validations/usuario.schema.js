import { z } from "zod";

export const registroSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido: z.string().min(2, "El apellido es obligatorio"),
  correo: z.string().email("Debe ser un correo válido"),
  contrasena: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
  rol: z.enum(["ADMIN", "USUARIO"], { message: "Rol inválido" }),
  tipo_usuario: z.enum(["ESTUDIANTE", "PROFESOR", "INVITADO"]).optional(),
  tipo_documento: z.string().optional(),
  numero_documento: z.string().optional(),
  telefono: z.string().optional(),
});
