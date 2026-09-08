import type {
  InspeccionSlot,
  PlanCobertura,
  VehiculoFormState,
  CoberturaFormState,
} from './types';

export const INITIAL_INSPECCION_SLOTS: InspeccionSlot[] = [
  // 7 Fotos obligatorias del vehículo
  {
    id: 'frente_patente',
    categoria: 'foto',
    titulo: 'Frente con patente',
    descripcion: 'Vista frontal completa con chapa patente claramente legible',
    obligatorio: true,
    subido: false,
  },
  {
    id: 'trasera_patente',
    categoria: 'foto',
    titulo: 'Trasera con patente',
    descripcion: 'Vista posterior completa con placa y ópticas visibles',
    obligatorio: true,
    subido: false,
  },
  {
    id: 'lateral_izquierdo',
    categoria: 'foto',
    titulo: 'Lateral izquierdo',
    descripcion: 'Costado del conductor de guardabarro a guardabarro',
    obligatorio: true,
    subido: false,
  },
  {
    id: 'lateral_derecho',
    categoria: 'foto',
    titulo: 'Lateral derecho',
    descripcion: 'Costado del acompañante de punta a punta sin cortes',
    obligatorio: true,
    subido: false,
  },
  {
    id: 'parabrisas_techo',
    categoria: 'foto',
    titulo: 'Parabrisas y techo',
    descripcion: 'Enfoque cenital y cristal frontal sin reflejos directos',
    obligatorio: true,
    subido: false,
  },
  {
    id: 'odometro_tablero',
    categoria: 'foto',
    titulo: 'Odómetro / Tablero',
    descripcion: 'Tablero en contacto con kilometraje y testigos encendidos',
    obligatorio: true,
    subido: false,
  },
  {
    id: 'neumaticos_auxilio',
    categoria: 'foto',
    titulo: 'Neumáticos y auxilio',
    descripcion: 'Profundidad de dibujo de cubiertas y rueda de auxilio',
    obligatorio: true,
    subido: false,
  },
  // 3 Documentos obligatorios
  {
    id: 'cedula_verde_frente',
    categoria: 'documento',
    titulo: 'Cédula Verde (Frente)',
    descripcion: 'Datos del titular, dominio y número de chasis/motor',
    obligatorio: true,
    subido: false,
  },
  {
    id: 'cedula_verde_dorso',
    categoria: 'documento',
    titulo: 'Cédula Verde (Dorso)',
    descripcion: 'Sellos de radicación, códigos y firmas oficiales',
    obligatorio: true,
    subido: false,
  },
  {
    id: 'licencia_conducir',
    categoria: 'documento',
    titulo: 'Licencia de conducir vigente',
    descripcion: 'Frente legible con categoría habilitante y vigencia',
    obligatorio: true,
    subido: false,
  },
];

export interface PlanOptionConfig {
  id: PlanCobertura;
  title: string;
  badge: string;
  recommended?: boolean;
  description: string;
  features: string[];
  franquiciaInfo: string;
}

export const PLAN_OPTIONS: PlanOptionConfig[] = [
  {
    id: 'TODO_RIESGO_CON_FRANQUICIA',
    title: 'Todo Riesgo con Franquicia',
    badge: 'Máxima Protección',
    recommended: true,
    description:
      'Daños parciales y totales por accidente, granizo sin tope, robo, incendio y reposición a nuevo el 1° año.',
    features: [
      'Daños por accidente con franquicia fija ($180.000)',
      'Granizo, inundación y desastre natural ilimitado',
      'Robo y hurto total y parcial sin deducible',
      'Auxilio mecánico y grúa satelital 24/7 sin límite',
      'Reposición de cubiertas por desgaste/rotura sin prorrateo',
    ],
    franquiciaInfo: 'Franquicia fija estimada: $180.000 por siniestro',
  },
  {
    id: 'TERCEROS_COMPLETO',
    title: 'Terceros Completo',
    badge: 'Más Elegido',
    description:
      'Responsabilidad civil, pérdida total o parcial por robo e incendio, más granizo y cerraduras.',
    features: [
      'Responsabilidad civil hasta $160.000.000',
      'Robo e incendio total y parcial sin franquicia',
      'Destrucción total con cláusula del 80%',
      'Cristales laterales, luneta y cerraduras bonificadas',
      'Auxilio mecánico hasta 300 km por evento',
    ],
    franquiciaInfo: 'Sin franquicia en robo e incendio',
  },
  {
    id: 'TERCEROS_BASICO',
    title: 'Terceros Básico',
    badge: 'Riesgo Esencial',
    description:
      'Protección obligatoria de ley complementada con cobertura por pérdida total ante robo o incendio.',
    features: [
      'Responsabilidad civil reglamentaria SSN',
      'Pérdida total por robo o hurto comprobable',
      'Pérdida total por incendio directo',
      'Asistencia mecánica ligera y auxilio 2 eventos/año',
    ],
    franquiciaInfo: 'Sin franquicia aplicable',
  },
  {
    id: 'RESPONSABILIDAD_CIVIL',
    title: 'Responsabilidad Civil',
    badge: 'Cobertura Legal Obligatoria',
    description:
      'Límite legal para circular en la vía pública ante daños materiales y corporales causados a terceros.',
    features: [
      'Límite asegurado legal obligatorio vigente',
      'Extensión automática a países limítrofes (Mercosur)',
      'Defensa civil y penal ante siniestros con terceros',
      'Auxilio mecánico de emergencia (1 evento)',
    ],
    franquiciaInfo: 'Sin franquicia',
  },
];

export const INITIAL_VEHICULO_STATE: VehiculoFormState = {
  esManual: false,
  marca: 'Toyota',
  marcaCodigo: 'toyota',
  modelo: 'Corolla',
  modeloCodigo: 'corolla',
  version: '',
  anio: 2024,
  valorDeclarado: '',
  patente: '',
  codigoPostal: '1425',
};

export const INITIAL_COBERTURA_STATE: CoberturaFormState = {
  plan: 'TODO_RIESGO_CON_FRANQUICIA',
  tieneGnc: false,
  kilometrajeAnual: 15000,
  garajeCubierto: true,
  conductoresAdicionales: [],
};
