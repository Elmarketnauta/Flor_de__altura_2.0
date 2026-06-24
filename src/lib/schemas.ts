import { z } from "zod";

// ─── Registro de usuario ──────────────────────────────────────────────────────

export const signupStep1Schema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Ingresa tu nombre")
      .max(50, "Máximo 50 caracteres"),
    lastName: z
      .string()
      .trim()
      .min(2, "Ingresa tu apellido")
      .max(50, "Máximo 50 caracteres"),
    dni: z
      .string()
      .trim()
      .regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos"),
    address: z
      .string()
      .trim()
      .min(5, "Ingresa tu dirección")
      .max(200, "Máximo 200 caracteres"),
    email: z
      .string()
      .trim()
      .email("Correo electrónico inválido")
      .max(120, "Máximo 120 caracteres"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(100, "Máximo 100 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type SignupStep1 = z.infer<typeof signupStep1Schema>;

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "El código debe tener 6 dígitos"),
});

export type VerifyCode = z.infer<typeof verifyCodeSchema>;

export const signupFinalSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  dni: z.string().regex(/^\d{8}$/),
  address: z.string().trim().min(5).max(200),
  email: z.string().email().max(120),
  password: z.string().min(8).max(100),
  verificationCode: z.string().length(6),
});

export type SignupFinal = z.infer<typeof signupFinalSchema>;

// ─── B2B Lead ─────────────────────────────────────────────────────────────────

/**
 * Validación del formulario de captación corporativa (B2B).
 * Captura: Empresa, Contacto, Email y Teléfono.
 * El email es el identificador primario que va a HubSpot.
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
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido")
    .max(120, "Máximo 120 caracteres"),
  phone: z
    .string()
    .trim()
    .regex(
      /^9\d{8}$/,
      "Ingresa un celular válido de 9 dígitos (ej. 998765432)",
    ),
  newsletter: z.boolean().optional().default(false),
});

export type B2BLead = z.infer<typeof b2bLeadSchema>;
