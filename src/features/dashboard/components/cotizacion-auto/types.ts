/**
 * Auto Insurance Quotation Types & Contracts
 *
 * Defines domain entities, wizard steps, form schemas, and submission contracts
 * for the multi-step auto insurance quotation and digital inspection module.
 *
 * @module features/dashboard/components/cotizacion-auto/types
 */

export type WizardStep = 1 | 2 | 3 | 4;

export type PlanCobertura =
  | 'TODO_RIESGO_CON_FRANQUICIA'
  | 'TERCEROS_COMPLETO'
  | 'TERCEROS_BASICO'
  | 'RESPONSABILIDAD_CIVIL';

export type KilometrajeOption = 8000 | 15000 | 25000;

export interface ConductorAdicional {
  id: string;
  nombreCompleto: string;
  parentesco: string;
  edad: number;
}

export interface VehiculoFormState {
  esManual: boolean;
  marca: string;
  marcaCodigo: string;
  modelo: string;
  modeloCodigo: string;
  version: string;
  anio: number;
  valorDeclarado: number | '';
  patente: string;
  codigoPostal: string;
}

export interface CoberturaFormState {
  plan: PlanCobertura;
  tieneGnc: boolean;
  kilometrajeAnual: KilometrajeOption;
  garajeCubierto: boolean;
  conductoresAdicionales: ConductorAdicional[];
}

export type InspeccionCategoria = 'foto' | 'documento';

export interface InspeccionSlot {
  id: string;
  categoria: InspeccionCategoria;
  titulo: string;
  descripcion: string;
  obligatorio: boolean;
  subido: boolean;
  archivoNombre?: string;
  archivoSize?: string;
  previewUrl?: string;
}

export interface TitularState {
  nombreCompleto: string;
  dni: string;
  email: string;
  telefono: string;
}

export interface CotizacionEstimacionRealTime {
  sumaAsegurada: number;
  primaMensualEstimada: number;
  franquicia: number | null;
  tasaPura?: number;
  factorPostal?: number;
  desglose?: {
    premioBase: number;
    recargoGnc: number;
    ajusteKilometraje: number;
    impuestos: number;
  };
}

export interface CotizacionRadicadaResultado {
  cotizacionId: string;
  numeroCotizacion: string;
  estado: 'PENDIENTE' | 'EN_REVISION_EXTENSA';
  tipoRevision: 'REVISION_ESTANDAR' | 'REVISION_EXTENSA';
  sumaAsegurada: number;
  primaMensualEstimada: number;
  fechaCreacion: string;
  esManual: boolean;
}
