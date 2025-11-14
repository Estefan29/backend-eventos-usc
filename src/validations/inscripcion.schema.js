import { z } from "zod";

export const inscripcionSchema = z.object({
  usuario_id: z.string().uuid(),
  evento_id: z.string().uuid(),
});
