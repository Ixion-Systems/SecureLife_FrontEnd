import type {
  CalculoVidaResultado,
  DesgloseCalculoVida,
  Paso1DatosAseguradoFormData,
  Paso2SaludHabitosFormData,
} from '../types/cotizacion-vida.types';

/**
 * Coeficiente de recargo etario sobre tasa base
 */
export function getFactorEdad(edad: number): number {
  if (edad <= 25) return 0.85;
  if (edad <= 35) return 1.0;
  if (edad <= 45) return 1.3;
  if (edad <= 55) return 1.8;
  if (edad <= 65) return 2.6;
  return 3.6;
}

/**
 * Coeficiente por categoría de riesgo ocupacional
 */
export function getFactorOcupacion(categoria: string): number {
  switch (categoria) {
    case 'COMERCIAL':
      return 1.15;
    case 'INDUSTRIAL':
      return 1.35;
    case 'ALTO_RIESGO':
      return 1.7;
    case 'ADMINISTRATIVO':
    default:
      return 1.0;
  }
}

/**
 * Motor actuarial puro de Seguro de Vida SecureLife
 */
export function calcularCotizacionVidaLocal(
  datosAsegurado: Partial<Paso1DatosAseguradoFormData>,
  saludHabitos: Partial<Paso2SaludHabitosFormData>,
  capitalAsegurado: number = 25_000_000,
  origen: 'api' | 'fallback_local' = 'fallback_local'
): CalculoVidaResultado {
  const edad = Number(datosAsegurado.edad) || 35;
  const factorEdad = getFactorEdad(edad);
  const factorOcupacion = getFactorOcupacion(datosAsegurado.categoriaRiesgo || 'ADMINISTRATIVO');

  // Tasa base técnica mensual: $ 450 por cada $ 1.000.000 de capital asegurable
  const tasaBasePorMillon = 450;
  const millones = capitalAsegurado / 1_000_000;
  const primaBase = Math.round(millones * tasaBasePorMillon);

  // Recargo por edad respecto a la base (edad estándar 30-35 = factor 1.0)
  const recargoEdad = Math.max(0, Math.round(primaBase * (factorEdad - 1.0)));

  // Recargo por tabaquismo habitual (+35%)
  const recargoTabaquismo = saludHabitos.esFumador ? Math.round(primaBase * 0.35) : 0;

  // Recargo por deportes de alto riesgo (+25%)
  const recargoDeportes = saludHabitos.practicaDeportesRiesgo ? Math.round(primaBase * 0.25) : 0;

  // Recargo por enfermedades preexistentes (+20% base + 10% por condición declarada)
  let recargoPreexistencias = 0;
  if (saludHabitos.tieneEnfermedadesPreexistentes) {
    const cantidadCondiciones = saludHabitos.enfermedadesDeclaradas?.length || 1;
    const pct = Math.min(0.6, 0.2 + (cantidadCondiciones - 1) * 0.1);
    recargoPreexistencias = Math.round(primaBase * pct);
  }

  // Bonificación por volumen de capital asegurable
  let pctDescuentoVolumen = 0;
  if (capitalAsegurado >= 70_000_000) {
    pctDescuentoVolumen = 0.1; // -10%
  } else if (capitalAsegurado >= 40_000_000) {
    pctDescuentoVolumen = 0.05; // -5%
  }
  const subtotalRiesgos =
    (primaBase + recargoEdad + recargoTabaquismo + recargoDeportes + recargoPreexistencias) *
    factorOcupacion;
  const descuentoVolumenCapital = Math.round(subtotalRiesgos * pctDescuentoVolumen);

  const subtotalPrimaTecnica = Math.round(subtotalRiesgos - descuentoVolumenCapital);

  // Sellados e impuestos de superintendencia (19%)
  const impuestosYSellados = Math.round(subtotalPrimaTecnica * 0.19);
  const primaMensualTotal = subtotalPrimaTecnica + impuestosYSellados;

  const desglose: DesgloseCalculoVida = {
    primaBase,
    recargoEdad,
    recargoTabaquismo,
    recargoDeportes,
    recargoPreexistencias,
    coeficienteOcupacion: factorOcupacion,
    descuentoVolumenCapital,
    subtotalPrimaTecnica,
    impuestosYSellados,
    primaMensualTotal,
    capitalAsegurado,
  };

  return {
    primaMensualEstimada: primaMensualTotal,
    capitalAseguradoTotal: capitalAsegurado,
    desglose,
    fechaCalculo: new Date().toISOString(),
    origen,
  };
}
