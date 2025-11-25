import { z } from "zod";

export const pagoSchema = z.object({
  eventoId: z.string().uuid(),
  usuarioId: z.string().uuid(),
  monto: z.number().min(0),
  metodo: z.enum(["EFECTIVO", "TRANSFERENCIA", "PLATAFORMA"]),
});
