import { z } from "zod";

/**
 * Validación del formulario de captación corporativa (B2B).
 * Captura: Empresa, Contacto y Teléfono (números peruanos de 9 dígitos).
 */
export const b2bLeadSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre de tu empresa")
    .max(80, "Máximo 80 caracteres"),
  contactName: z
    .string()
    .trim()
    .min(3, "Ingresa tu nombre y apellido")
    .max(80, "Máximo 80 caracteres"),
  phone: z
    .string()
    .trim()
    .regex(
      /^9\d{8}$/,
      "Ingresa un celular válido de 9 dígitos (ej. 998765432)",
    ),
});

export type B2BLead = z.infer<typeof b2bLeadSchema>;
