import { z } from 'zod';

/**
 * Sign Up validation schema.
 * Enforces Argentine full name, DNI/CUIL, email, cell phone, password complexity, and terms acceptance.
 */
export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Ingresa tu nombre y apellido completos')
    .refine((val) => val.trim().split(' ').length >= 2, {
      message: 'Ingresa al menos tu nombre y un apellido',
    }),
  idNumber: z
    .string()
    .min(7, 'El DNI o CUIL debe tener al menos 7 dígitos')
    .max(11, 'El DNI o CUIL no puede superar 11 dígitos')
    .regex(/^[0-9]+$/, 'Ingresa únicamente números sin puntos ni guiones'),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  phone: z
    .string()
    .min(8, 'Ingresa un número telefónico válido')
    .regex(/^[0-9+\s()-]+$/, 'Formato de teléfono inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número'),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar los Términos de Servicio y Políticas de Privacidad',
    }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Login validation schema.
 * Supports email address or Argentine national ID (DNI 7-8 digits).
 */
export const loginSchema = z.object({
  emailOrDni: z
    .string()
    .min(1, 'El correo electrónico o DNI es requerido')
    .refine((val) => {
      const trimmed = val.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      const isDni = /^[0-9]{7,8}$/.test(trimmed.replace(/\./g, ''));
      return isEmail || isDni;
    }, 'Ingresa un correo electrónico válido o número de DNI (7-8 dígitos)'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
