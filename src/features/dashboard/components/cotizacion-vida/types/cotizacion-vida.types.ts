import { z } from 'zod';

/**
 * Géneros asegurables reconocidos oficialmente
 */
export const GeneroAseguradoEnum = z.enum(['MASCULINO', 'FEMENINO', 'OTRO']);
export type GeneroAsegurado = z.infer<typeof GeneroAseguradoEnum>;

/**
 * Categorías de riesgo laboral
 */
export const CategoriaRiesgoLaboralEnum = z.enum([
  'ADMINISTRATIVO', // Riesgo bajo (factor 1.0)
  'COMERCIAL',      // Riesgo medio-bajo (factor 1.15)
  'INDUSTRIAL',     // Riesgo moderado (factor 1.35)
  'ALTO_RIESGO',    // Riesgo elevado (factor 1.70)
]);
export type CategoriaRiesgoLaboral = z.infer<typeof CategoriaRiesgoLaboralEnum>;

/**
 * Esquema Paso 1: Datos del Asegurado
 */
export const Paso1DatosAseguradoSchema = z.object({
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine((val) => {
      const fecha = new Date(val);
      if (isNaN(fecha.getTime())) return false;
      const hoy = new Date();
      let edad = hoy.getFullYear() - fecha.getFullYear();
      const m = hoy.getMonth() - fecha.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }
      return edad >= 18 && edad <= 75;
    }, 'La edad debe estar comprendida entre 18 y 75 años para suscripción digital'),
  edad: z
    .number({ invalid_type_error: 'Ingresa una edad válida' })
    .min(18, 'La edad mínima asegurable es 18 años')
    .max(75, 'La edad máxima asegurable es 75 años'),
  genero: GeneroAseguradoEnum,
  ocupacion: z.string().trim().min(3, 'Especifica tu ocupación o profesión principal'),
  categoriaRiesgo: CategoriaRiesgoLaboralEnum,
});
export type Paso1DatosAseguradoFormData = z.infer<typeof Paso1DatosAseguradoSchema>;

/**
 * Esquema Paso 2: Salud y Hábitos de Vida
 */
export const Paso2SaludHabitosSchema = z.object({
  esFumador: z.boolean(),
  cigarrillosPorDia: z.number().optional(),
  practicaDeportesRiesgo: z.boolean(),
  deportesDeclarados: z.array(z.string()),
  tieneEnfermedadesPreexistentes: z.boolean(),
  enfermedadesDeclaradas: z.array(z.string()),
  observacionesSalud: z.string().trim().optional(),
});
export type Paso2SaludHabitosFormData = z.infer<typeof Paso2SaludHabitosSchema>;

/**
 * Parentesco con el asegurado titular
 */
export const ParentescoBeneficiarioEnum = z.enum([
  'CONYUGE',
  'HIJO',
  'PADRE_MADRE',
  'HERMANO',
  'OTRO',
]);
export type ParentescoBeneficiario = z.infer<typeof ParentescoBeneficiarioEnum>;

/**
 * Esquema de un Beneficiario Individual
 */
export const BeneficiarioSchema = z.object({
  id: z.string(),
  nombreCompleto: z
    .string()
    .trim()
    .min(3, 'Ingresa el nombre y apellido completo (mínimo 3 caracteres)'),
  dni: z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, 'El DNI debe contener 7 u 8 dígitos numéricos sin puntos'),
  parentesco: ParentescoBeneficiarioEnum,
  porcentaje: z
    .number({ invalid_type_error: 'Ingresa un porcentaje' })
    .min(1, 'El porcentaje mínimo por beneficiario es 1%')
    .max(100, 'El porcentaje máximo individual es 100%'),
});
export type Beneficiario = z.infer<typeof BeneficiarioSchema>;

/**
 * Esquema Paso 3: Capital Asegurado y Beneficiarios
 */
export const Paso3CapitalBeneficiariosSchema = z
  .object({
    capitalAsegurado: z
      .number({ invalid_type_error: 'Ingresa el capital asegurable' })
      .min(10_000_000, 'El capital mínimo asegurable es de $10.000.000 ARS')
      .max(100_000_000, 'El capital máximo asegurable es de $100.000.000 ARS'),
    beneficiarios: z
      .array(BeneficiarioSchema)
      .min(1, 'Debes designar al menos un (1) beneficiario legal'),
  })
  .refine(
    (data) => {
      const suma = data.beneficiarios.reduce((acc, b) => acc + (Number(b.porcentaje) || 0), 0);
      return Math.round(suma) === 100;
    },
    {
      message: 'La suma de porcentajes de los beneficiarios debe ser exactamente 100%',
      path: ['beneficiarios'],
    }
  );
export type Paso3CapitalBeneficiariosFormData = z.infer<typeof Paso3CapitalBeneficiariosSchema>;

/**
 * Esquema Consolidado del Formulario de Cotización de Vida
 */
export const CotizacionVidaFormSchema = Paso1DatosAseguradoSchema
  .merge(Paso2SaludHabitosSchema)
  .merge(
    z.object({
      capitalAsegurado: z.number().min(10_000_000).max(100_000_000),
      beneficiarios: z.array(BeneficiarioSchema).min(1),
      aceptaTerminos: z.literal(true, {
        errorMap: () => ({ message: 'Debes aceptar los términos y la declaración jurada' }),
      }),
    })
  );
export type CotizacionVidaFormData = z.infer<typeof CotizacionVidaFormSchema>;

/**
 * Desglose Actuarial del Seguro de Vida
 */
export interface DesgloseCalculoVida {
  primaBase: number;
  recargoEdad: number;
  recargoTabaquismo: number;
  recargoDeportes: number;
  recargoPreexistencias: number;
  coeficienteOcupacion: number;
  descuentoVolumenCapital: number;
  subtotalPrimaTecnica: number;
  impuestosYSellados: number;
  primaMensualTotal: number;
  capitalAsegurado: number;
}

/**
 * Resultado de Cálculo Preliminar
 */
export interface CalculoVidaResultado {
  primaMensualEstimada: number;
  capitalAseguradoTotal: number;
  desglose: DesgloseCalculoVida;
  fechaCalculo: string;
  origen: 'api' | 'fallback_local';
}

/**
 * Resultado de la Radicación Exitosa de Vida
 */
export interface RadicacionVidaResultado {
  cotizacionId: string;
  numeroCotizacion: string;
  estado: string;
  mensaje: string;
  tiempoEstimadoRevision: string;
  fechaRadicacion: string;
  primaMensualFinal: number;
  capitalAsegurado: number;
  beneficiarios: Beneficiario[];
}

/**
 * Estados asíncronos del wizard
 */
export type AsyncCalculoVidaState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'calculating'; data: CalculoVidaResultado | null; error: null }
  | { status: 'success'; data: CalculoVidaResultado; error: null }
  | { status: 'error'; data: null; error: string };

export type AsyncRadicacionVidaState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'submitting'; data: null; error: null }
  | { status: 'success'; data: RadicacionVidaResultado; error: null }
  | { status: 'error'; data: null; error: string };

export type VidaWizardStepNumber = 1 | 2 | 3 | 4;
