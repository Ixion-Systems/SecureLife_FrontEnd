import { z } from 'zod';

/**
 * Conductor Adicional Zod Schema
 */
export const ConductorAdicionalSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  parentesco: z
    .string()
    .trim()
    .min(2, 'Especifica el parentesco (ej: Cónyuge, Hijo/a)'),
  edad: z
    .number({ invalid_type_error: 'La edad debe ser un número' })
    .min(17, 'El conductor debe ser mayor de 17 años')
    .max(99, 'Edad inválida'),
});

/**
 * Titular Zod Schema
 */
export const TitularSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(3, 'El nombre completo debe tener al menos 3 caracteres'),
  dni: z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, 'DNI debe contener entre 7 y 8 dígitos sin puntos ni espacios'),
  email: z
    .string()
    .trim()
    .email('Ingresa un correo electrónico válido'),
  telefono: z
    .string()
    .trim()
    .min(8, 'Ingresa un número telefónico válido (mínimo 8 dígitos)'),
});

/**
 * Vehiculo Zod Schema
 */
export const VehiculoSchema = z.object({
  patente: z
    .string()
    .trim()
    .toUpperCase()
    .min(6, 'Formato de patente inválido (ej: AA123BB o ABC123)')
    .max(9, 'Patente demasiado larga')
    .regex(/^[A-Z0-9\s]{6,9}$/, 'Solo letras y números en la patente'),
  marca: z
    .string()
    .trim()
    .min(2, 'Selecciona o escribe la marca del vehículo'),
  modelo: z
    .string()
    .trim()
    .min(2, 'Ingresa el modelo del vehículo'),
  anio: z
    .number({ invalid_type_error: 'Ingresa un año válido' })
    .int('El año debe ser un número entero')
    .min(1995, 'El vehículo debe ser del año 1995 o posterior')
    .max(new Date().getFullYear() + 1, 'Año no válido'),
  tieneGnc: z.boolean(),
  kilometrajePromedioAnual: z
    .number({ invalid_type_error: 'Ingresa el kilometraje promedio' })
    .min(0, 'El kilometraje no puede ser negativo')
    .max(250000, 'El kilometraje anual supera el límite asegurable'),
});

/**
 * Cobertura Tipo Enum
 */
export const CoberturaTipoEnum = z.enum([
  'RESPONSABILIDAD_CIVIL',
  'TERCEROS_COMPLETO',
  'TODO_RIESGO_CON_FRANQUICIA',
]);

/**
 * Cotizacion Auto Form Schema
 * Matches exactly the backend contract required for Auto Insurance Quoting.
 */
export const CotizacionAutoSchema = z.object({
  titular: TitularSchema,
  vehiculo: VehiculoSchema,
  coberturaSolicitada: CoberturaTipoEnum,
  conductoresAdicionales: z.array(ConductorAdicionalSchema),
});

// Inferred TypeScript Types
export type CotizacionAutoFormData = z.infer<typeof CotizacionAutoSchema>;
export type TitularFormData = z.infer<typeof TitularSchema>;
export type VehiculoFormData = z.infer<typeof VehiculoSchema>;
export type ConductorAdicionalFormData = z.infer<typeof ConductorAdicionalSchema>;
export type CoberturaTipo = z.infer<typeof CoberturaTipoEnum>;

/**
 * Breakdown of the calculated auto quote
 */
export interface DesgloseCotizacion {
  premioBase: number;
  recargoGnc: number;
  ajusteKilometraje: number;
  recargoConductores: number;
  impuestos: number;
}

/**
 * Calculated result returned either by the backend API or the local fallback engine
 */
export interface ResultadoCotizacion {
  id: string;
  cobertura: CoberturaTipo;
  primaMensualEstimada: number;
  sumaAsegurada: number;
  franquicia: number | null;
  desglose: DesgloseCotizacion;
  fechaCalculo: string;
  origen: 'api' | 'fallback_local';
}

/**
 * Discriminated Union for Asynchronous Quote Calculation State
 */
export type AsyncCotizacionState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: ResultadoCotizacion; error: null }
  | { status: 'error'; data: null; error: string };

/**
 * Step Identifier for the 4-step wizard
 */
export type WizardStepNumber = 1 | 2 | 3 | 4;
