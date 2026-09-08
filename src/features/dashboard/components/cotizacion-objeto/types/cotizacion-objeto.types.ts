import { z } from 'zod';

/**
 * Tipologías de objetos asegurables admitidas
 */
export const TipoObjetoEnum = z.enum([
  'SMARTPHONE',
  'NOTEBOOK',
  'CAMARA',
  'MICROMOVILIDAD',
]);
export type TipoObjeto = z.infer<typeof TipoObjetoEnum>;

/**
 * Esquema Paso 1: Tipología del Bien
 */
export const Paso1TipologiaSchema = z.object({
  tipoObjeto: TipoObjetoEnum,
});
export type Paso1TipologiaFormData = z.infer<typeof Paso1TipologiaSchema>;

/**
 * Esquema Paso 2: Identificación y Valuación
 */
export const Paso2IdentificacionValuacionSchema = z
  .object({
    tipoObjeto: TipoObjetoEnum,
    marca: z.string().trim().min(2, 'La marca del bien es obligatoria'),
    modelo: z.string().trim().min(2, 'El modelo exacto es obligatorio'),
    numeroSerieOimei: z.string().trim().min(4, 'Ingresa el identificador único del bien'),
    valorEstimado: z
      .number({ invalid_type_error: 'Ingresa el valor de reposición estimado' })
      .min(100_000, 'El valor asegurable mínimo es de $100.000 ARS')
      .max(15_000_000, 'El valor asegurable máximo es de $15.000.000 ARS'),
    anioCompra: z
      .number({ invalid_type_error: 'Ingresa el año de adquisición' })
      .min(2018, 'La antigüedad máxima admitida es desde 2018')
      .max(new Date().getFullYear(), 'El año no puede ser futuro'),
  })
  .superRefine((data, ctx) => {
    if (data.tipoObjeto === 'SMARTPHONE') {
      const limpio = data.numeroSerieOimei.replace(/\D/g, '');
      if (limpio.length !== 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Para smartphones, el IMEI debe contener exactamente 15 dígitos numéricos (*#06#)',
          path: ['numeroSerieOimei'],
        });
      }
    }
  });
export type Paso2IdentificacionValuacionFormData = z.infer<typeof Paso2IdentificacionValuacionSchema>;

/**
 * Slot pericial de inspección digital
 */
export interface InspeccionObjetoArchivo {
  id: string;
  tipo: 'FRENTE_PANTALLA' | 'DORSO_SERIE' | 'FACTURA_COMPRA';
  nombreArchivo: string;
  tamanoBytes: number;
  previewUrl: string;
  fechaCarga: string;
}

/**
 * Esquema Paso 3: Inspección Digital y Comprobantes
 */
export const Paso3InspeccionObjetoSchema = z.object({
  archivos: z
    .array(z.custom<InspeccionObjetoArchivo>())
    .min(2, 'Debes cargar al menos la foto del equipo y el comprobante de compra'),
});
export type Paso3InspeccionObjetoFormData = z.infer<typeof Paso3InspeccionObjetoSchema>;

/**
 * Paquetes y coberturas seleccionables
 */
export const CoberturasObjetoSchema = z.object({
  cubreRoboExpress: z.boolean(),
  cubreDanoAccidental: z.boolean(),
  cubreDerrameLiquidos: z.boolean(),
});
export type CoberturasObjetoFormData = z.infer<typeof CoberturasObjetoSchema>;

/**
 * Esquema Consolidado del Formulario de Cotización de Objetos
 */
export const CotizacionObjetoFormSchema = z
  .object({
    tipoObjeto: TipoObjetoEnum,
    marca: z.string().trim().min(2, 'La marca es obligatoria'),
    modelo: z.string().trim().min(2, 'El modelo es obligatorio'),
    numeroSerieOimei: z.string().trim().min(4, 'El identificador único es obligatorio'),
    valorEstimado: z.number().min(100_000).max(15_000_000),
    anioCompra: z.number().min(2018).max(new Date().getFullYear()),
    archivos: z.array(z.custom<InspeccionObjetoArchivo>()),
    cubreRoboExpress: z.boolean(),
    cubreDanoAccidental: z.boolean(),
    cubreDerrameLiquidos: z.boolean(),
    aceptaTerminos: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar los términos y condiciones de la póliza' }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.tipoObjeto === 'SMARTPHONE') {
      const limpio = data.numeroSerieOimei.replace(/\D/g, '');
      if (limpio.length !== 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Para smartphones, el IMEI debe contener exactamente 15 dígitos numéricos',
          path: ['numeroSerieOimei'],
        });
      }
    }
  });
export type CotizacionObjetoFormData = z.infer<typeof CotizacionObjetoFormSchema>;

/**
 * Desglose Actuarial para Objetos y Tecnología
 */
export interface DesgloseCalculoObjeto {
  valorReposicion: number;
  tasaBasePct: number;
  primaRoboExpress: number;
  primaDanoAccidental: number;
  primaDerrameLiquidos: number;
  subtotalPrimaTecnica: number;
  franquiciaPct: number; // 10% fija
  montoFranquiciaARS: number;
  impuestosYSellados: number;
  primaMensualTotal: number;
}

/**
 * Resultado de Cálculo Preliminar
 */
export interface CalculoObjetoResultado {
  primaMensualEstimada: number;
  valorAsegurado: number;
  franquiciaFija: number; // 10% del valor asegurable
  desglose: DesgloseCalculoObjeto;
  fechaCalculo: string;
  origen: 'api' | 'fallback_local';
}

/**
 * Resultado de Radicación Oficial de Objeto
 */
export interface RadicacionObjetoResultado {
  cotizacionId: string;
  numeroCotizacion: string;
  estado: string;
  mensaje: string;
  tiempoEstimadoRevision: string;
  fechaRadicacion: string;
  primaMensualFinal: number;
  valorAsegurado: number;
  franquiciaFija: number;
  bienAsegurado: {
    tipo: TipoObjeto;
    marca: string;
    modelo: string;
    identificador: string;
  };
}

/**
 * Estados asíncronos del wizard
 */
export type AsyncCalculoObjetoState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'calculating'; data: CalculoObjetoResultado | null; error: null }
  | { status: 'success'; data: CalculoObjetoResultado; error: null }
  | { status: 'error'; data: null; error: string };

export type AsyncRadicacionObjetoState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'submitting'; data: null; error: null }
  | { status: 'success'; data: RadicacionObjetoResultado; error: null }
  | { status: 'error'; data: null; error: string };

export type ObjetoWizardStepNumber = 1 | 2 | 3 | 4;
