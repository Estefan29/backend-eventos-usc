import { z } from "zod";

export const eventoSchema = z.object({
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  tipo_evento: z.enum(["ACADEMICO", "CULTURAL", "DEPORTIVO", "OTRO"]),
  tipo_pago: z.enum(["GRATUITO", "PAGO"]),
  precio: z.number().nonnegative(),
  lugar: z.string(),
  direccion: z.string().optional(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  inicio_inscripcion: z.string(),
  fin_inscripcion: z.string(),
  capacidad: z.number().int().positive(),
  cupos_disponibles: z.number().int().nonnegative(),
  url_imagen: z.string().optional(),
});
