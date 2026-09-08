import { z } from 'zod';

/**
 * Enumeración estricta de tipos de inmuebles según estándar asegurador
 */
export const TipoInmuebleEnum = z.enum([
  'CASA',
  'DEPARTAMENTO',
  'PH',
  'COUNTRY_BARRIO_CERRADO',
  'LOCAL_COMERCIAL',
]);
export type TipoInmueble = z.infer<typeof TipoInmuebleEnum>;

/**
 * Tipos de techos constructivos
 */
export const TipoTechoEnum = z.enum([
  'LOSA_HORMIGON',
  'CHAPA',
  'TEJA',
]);
export type TipoTecho = z.infer<typeof TipoTechoEnum>;

/**
 * Tipos de documentos de titularidad admitidos
 */
export const TipoDocumentoTitularidadEnum = z.enum([
  'ESCRITURA',
  'BOLETO_COMPRAVENTA',
  'CONTRATO_ALQUILER',
]);
export type TipoDocumentoTitularidad = z.infer<typeof TipoDocumentoTitularidadEnum>;

/**
 * Esquema Paso 1: Ubicación y Tipología
 */
export const Paso1UbicacionSchema = z.object({
  calle: z.string().trim().min(2, 'La calle es obligatoria (mínimo 2 caracteres)'),
  numero: z.string().trim().min(1, 'El número es obligatorio'),
  piso: z.string().trim().optional().or(z.literal('')),
  depto: z.string().trim().optional().or(z.literal('')),
  codigoPostal: z.string().trim().min(4, 'Código postal inválido (mínimo 4 dígitos)'),
  ciudad: z.string().trim().min(2, 'La ciudad o localidad es obligatoria'),
  provincia: z.string().trim().min(2, 'La provincia es obligatoria'),
  tipoInmueble: TipoInmuebleEnum,
  superficieM2: z.number({ invalid_type_error: 'Ingresa los m² cubiertos' })
    .min(15, 'La superficie mínima asegurable es de 15 m²')
    .max(10000, 'Superficie máxima permitida es de 10.000 m²'),
  anioConstruccion: z.number({ invalid_type_error: 'Ingresa un año válido' })
    .int('Debe ser un número entero')
    .min(1920, 'Año mínimo de construcción 1920')
    .max(new Date().getFullYear() + 1, 'Año de construcción no puede ser futuro'),
  tipoTecho: TipoTechoEnum,
});
export type Paso1UbicacionFormData = z.infer<typeof Paso1UbicacionSchema>;

/**
 * Esquema Paso 2: Medidas de Seguridad & Coberturas
 */
export const Paso2SeguridadCoberturasSchema = z.object({
  // Medidas de Seguridad
  alarmaMonitoreada: z.boolean(),
  rejasPerimetrales: z.boolean(),
  puertaBlindada: z.boolean(),
  camarasVigilancia: z.boolean(),

  // Sumas Aseguradas
  sumaEdificio: z.number({ invalid_type_error: 'Ingresa la suma del edificio' })
    .min(5000000, 'La suma mínima de edificio es de $5.000.000'),
  sumaContenido: z.number({ invalid_type_error: 'Ingresa la suma del contenido' })
    .min(1000000, 'La suma mínima de contenido es de $1.000.000'),
  sumaElectrodomesticos: z.number({ invalid_type_error: 'Ingresa la suma de tecnología' })
    .min(500000, 'La suma mínima de tecnología es de $500.000'),
  sumaRCLinderos: z.number({ invalid_type_error: 'Ingresa la suma de RC linderos' })
    .min(5000000, 'La suma mínima de RC es de $5.000.000'),
});
export type Paso2SeguridadCoberturasFormData = z.infer<typeof Paso2SeguridadCoberturasSchema>;

/**
 * Interfaz de Archivo Cargado
 */
export interface InspeccionArchivo {
  id: string;
  tipo: 'FACHADA' | 'CERRADURA_REJAS' | 'ALARMA_CAMARAS' | 'TITULARIDAD';
  nombreArchivo: string;
  tamanoBytes: number;
  previewUrl: string;
  tipoMime: string;
  fechaCarga: string;
}

/**
 * Esquema Paso 3: Inspección Digital
 */
export const Paso3InspeccionSchema = z.object({
  tipoDocumentoTitularidad: TipoDocumentoTitularidadEnum,
  archivos: z.array(z.custom<InspeccionArchivo>()),
});
export type Paso3InspeccionFormData = z.infer<typeof Paso3InspeccionSchema>;

/**
 * Esquema Consolidado del Formulario de Cotización de Inmueble
 */
export const CotizacionInmuebleFormSchema = Paso1UbicacionSchema
  .merge(Paso2SeguridadCoberturasSchema)
  .extend({
    tipoDocumentoTitularidad: TipoDocumentoTitularidadEnum,
    archivos: z.array(z.custom<InspeccionArchivo>()),
  });
export type CotizacionInmuebleFormData = z.infer<typeof CotizacionInmuebleFormSchema>;

/**
 * Desglose del Cálculo Actuarial de Inmueble
 */
export interface DesgloseCalculoInmueble {
  primaEdificio: number;
  primaContenido: number;
  primaElectrodomesticos: number;
  primaRCLinderos: number;
  subtotalPrima: number;
  descuentoAlarma: number;
  descuentoRejas: number;
  descuentoPuertaBlindada: number;
  descuentoCamaras: number;
  totalBonificaciones: number;
  baseImponible: number;
  impuestos: number;
  primaMensualTotal: number;
  tasaDescuentoTotalPct: number;
}

/**
 * Resultado de Cálculo Preliminar
 */
export interface CalculoInmuebleResultado {
  primaMensualEstimada: number;
  sumaAseguradaTotal: number;
  desglose: DesgloseCalculoInmueble;
  fechaCalculo: string;
  origen: 'api' | 'fallback_local';
}

/**
 * Resultado de la Radicación Exitosa
 */
export interface RadicacionInmuebleResultado {
  cotizacionId: string;
  numeroCotizacion: string;
  estado: string;
  mensaje: string;
  tiempoEstimadoRevision: string;
  fechaRadicacion: string;
  primaMensualFinal: number;
  sumaAseguradaTotal: number;
}

/**
 * Estados Asíncronos
 */
export type AsyncCalculoState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'calculating'; data: CalculoInmuebleResultado | null; error: null }
  | { status: 'success'; data: CalculoInmuebleResultado; error: null }
  | { status: 'error'; data: null; error: string };

export type AsyncRadicacionState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'submitting'; data: null; error: null }
  | { status: 'success'; data: RadicacionInmuebleResultado; error: null }
  | { status: 'error'; data: null; error: string };

export type InmuebleWizardStepNumber = 1 | 2 | 3 | 4;
