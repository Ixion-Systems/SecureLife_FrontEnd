import type {
  TipoInmueble,
  Paso2SeguridadCoberturasFormData,
  CalculoInmuebleResultado,
  DesgloseCalculoInmueble,
} from '../types/cotizacion-inmueble.types';

/**
 * Costos de reposición base sugeridos por metro cuadrado (pesos argentinos)
 */
export const COSTOS_M2_POR_TIPO: Record<TipoInmueble, number> = {
  COUNTRY_BARRIO_CERRADO: 1550000,
  DEPARTAMENTO: 1350000,
  CASA: 1200000,
  PH: 1100000,
  LOCAL_COMERCIAL: 1000000,
};

/**
 * Calcula el valor sugerido de reposición a nuevo del edificio en base a los m2 y tipología
 */
export function calcularValorReposicionSugerido(
  tipoInmueble: TipoInmueble,
  superficieM2: number
): number {
  const m2 = Math.max(10, superficieM2 || 50);
  const costoUnitario = COSTOS_M2_POR_TIPO[tipoInmueble] || 1200000;
  return Math.round(m2 * costoUnitario);
}

/**
 * Calcula el valor sugerido de contenido (30% del edificio)
 */
export function calcularContenidoSugerido(sumaEdificio: number): number {
  return Math.round(sumaEdificio * 0.3);
}

/**
 * Calcula el valor sugerido de electrodomésticos y tecnología (15% del edificio)
 */
export function calcularElectroSugerido(sumaEdificio: number): number {
  return Math.round(sumaEdificio * 0.15);
}

/**
 * Motor actuarial local determinista para cotización de Inmuebles.
 * Se utiliza como cálculo instantáneo y como fallback resiliente en caso de
 * indisponibilidad temporal del servidor backend.
 */
export function calcularCotizacionInmuebleLocal(
  coberturas: Paso2SeguridadCoberturasFormData,
  origen: 'api' | 'fallback_local' = 'fallback_local'
): CalculoInmuebleResultado {
  const {
    sumaEdificio,
    sumaContenido,
    sumaElectrodomesticos,
    sumaRCLinderos,
    alarmaMonitoreada,
    rejasPerimetrales,
    puertaBlindada,
    camarasVigilancia,
  } = coberturas;

  // 1. Tasas actuariales mensuales de riesgo
  // Tasa Edificio: ~0.085% anual dividido 12
  const primaEdificio = Math.round((sumaEdificio * 0.00085) / 12);

  // Tasa Contenido General: ~0.22% anual dividido 12 (incendio + robo base)
  const primaContenido = Math.round((sumaContenido * 0.0022) / 12);

  // Tasa Electrodomésticos y Tecnología: ~0.35% anual dividido 12
  const primaElectrodomesticos = Math.round((sumaElectrodomesticos * 0.0035) / 12);

  // Tasa Responsabilidad Civil Linderos: ~0.06% anual dividido 12 + base operativa
  const primaRCLinderos = Math.round((sumaRCLinderos * 0.0006) / 12 + 1800);

  const subtotalPrima = primaEdificio + primaContenido + primaElectrodomesticos + primaRCLinderos;

  // 2. Bonificaciones por medidas preventivas de seguridad
  // - Alarma Monitoreada 24h: 10% de descuento en prima de robo/contenido
  const baseRoboContenido = primaContenido + primaElectrodomesticos;
  const descuentoAlarma = alarmaMonitoreada ? Math.round(baseRoboContenido * 0.1) : 0;

  // - Rejas perimetrales en todas las aberturas: 5% de descuento en prima de robo/contenido
  const descuentoRejas = rejasPerimetrales ? Math.round(baseRoboContenido * 0.05) : 0;

  // - Puerta principal blindada / Cerradura multianclaje: Bonificación fija mensual
  const descuentoPuertaBlindada = puertaBlindada ? 2200 : 0;

  // - Cámaras de videovigilancia: Bonificación fija mensual
  const descuentoCamaras = camarasVigilancia ? 1500 : 0;

  const totalBonificaciones =
    descuentoAlarma + descuentoRejas + descuentoPuertaBlindada + descuentoCamaras;

  // Base imponible mínima de seguridad operativa ($14.500)
  const baseImponible = Math.max(14500, subtotalPrima - totalBonificaciones);

  // 3. Carga impositiva reglamentaria (IVA 21% + Sellos provinciales y Tasa SSN 5% = 26%)
  const TASA_IMPUESTOS = 0.26;
  const impuestos = Math.round(baseImponible * TASA_IMPUESTOS);
  const primaMensualTotal = baseImponible + impuestos;

  const sumaAseguradaTotal =
    sumaEdificio + sumaContenido + sumaElectrodomesticos + sumaRCLinderos;

  const tasaDescuentoTotalPct =
    subtotalPrima > 0 ? Math.round((totalBonificaciones / subtotalPrima) * 100) : 0;

  const desglose: DesgloseCalculoInmueble = {
    primaEdificio,
    primaContenido,
    primaElectrodomesticos,
    primaRCLinderos,
    subtotalPrima,
    descuentoAlarma,
    descuentoRejas,
    descuentoPuertaBlindada,
    descuentoCamaras,
    totalBonificaciones,
    baseImponible,
    impuestos,
    primaMensualTotal,
    tasaDescuentoTotalPct,
  };

  return {
    primaMensualEstimada: primaMensualTotal,
    sumaAseguradaTotal,
    desglose,
    fechaCalculo: new Date().toISOString(),
    origen,
  };
}
