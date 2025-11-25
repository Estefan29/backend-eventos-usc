import { z } from "zod";

export const ticketSchema = z.object({
  usuarioId: z.string().uuid(),
  eventoId: z.string().uuid(),
  codigo: z.string().min(6),
});
