import type {
  CotizacionAutoFormData,
  ResultadoCotizacion,
  DesgloseCotizacion,
  CoberturaTipo,
} from '../types/cotizacion-auto.types';

/**
 * Pure calculation function for auto insurance quoting.
 * Provides consistent, deterministic, and realistic premium values matching the backend logic.
 *
 * @param {CotizacionAutoFormData} data - Form data entered by user.
 * @param {'api' | 'fallback_local'} origen - Origin of calculation result.
 * @returns {ResultadoCotizacion} Detailed calculated quote.
 */
export function calcularCotizacionLocal(
  data: CotizacionAutoFormData,
  origen: 'api' | 'fallback_local' = 'fallback_local'
): ResultadoCotizacion {
  const currentYear = new Date().getFullYear();
  const yearDiff = Math.max(0, currentYear - data.vehiculo.anio);

  // Estimación de Suma Asegurada según antigüedad y depreciación base
  const baseSumaAsegurada = 28000000;
  const factorAntiguedad = Math.max(0.35, 1 - yearDiff * 0.045);
  const sumaAsegurada = Math.round(baseSumaAsegurada * factorAntiguedad);

  // Premio base según cobertura
  let premioBase = 0;
  let franquicia: number | null = null;

  switch (data.coberturaSolicitada) {
    case 'RESPONSABILIDAD_CIVIL':
      premioBase = 28500;
      franquicia = null;
      break;
    case 'TERCEROS_COMPLETO':
      premioBase = Math.round(42000 + sumaAsegurada * 0.0006);
      franquicia = null;
      break;
    case 'TODO_RIESGO_CON_FRANQUICIA':
      premioBase = Math.round(75000 + sumaAsegurada * 0.0011);
      franquicia = Math.round(sumaAsegurada * 0.035); // 3.5% de suma asegurada
      break;
  }

  // Recargo por GNC (+12%)
  const recargoGnc = data.vehiculo.tieneGnc ? Math.round(premioBase * 0.12) : 0;

  // Ajuste por kilometraje
  let ajusteKilometraje = 0;
  if (data.vehiculo.kilometrajePromedioAnual > 20000) {
    ajusteKilometraje = Math.round(premioBase * 0.10);
  } else if (data.vehiculo.kilometrajePromedioAnual < 10000 && data.vehiculo.kilometrajePromedioAnual > 0) {
    ajusteKilometraje = -Math.round(premioBase * 0.05);
  }

  // Recargo por conductores adicionales
  let recargoConductores = 0;
  if (data.conductoresAdicionales && data.conductoresAdicionales.length > 0) {
    for (const cond of data.conductoresAdicionales) {
      if (cond.edad < 25) {
        recargoConductores += Math.round(premioBase * 0.15);
      } else {
        recargoConductores += Math.round(premioBase * 0.08);
      }
    }
  }

  const subtotal = premioBase + recargoGnc + ajusteKilometraje + recargoConductores;
  const impuestos = Math.round(subtotal * 0.21); // 21% IVA y tasas
  const primaMensualEstimada = subtotal + impuestos;

  const desglose: DesgloseCotizacion = {
    premioBase,
    recargoGnc,
    ajusteKilometraje,
    recargoConductores,
    impuestos,
  };

  return {
    id: `COT-${Date.now().toString(36).toUpperCase()}`,
    cobertura: data.coberturaSolicitada,
    primaMensualEstimada,
    sumaAsegurada,
    franquicia,
    desglose,
    fechaCalculo: new Date().toISOString(),
    origen,
  };
}

/**
 * Format currency in Argentine Pesos (ARS)
 */
export function formatCurrencyARS(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Friendly label for coverage types
 */
export const COBERTURA_LABELS: Record<CoberturaTipo, { title: string; desc: string; badge: string }> = {
  RESPONSABILIDAD_CIVIL: {
    title: 'Responsabilidad Civil',
    desc: 'Obligatoria por ley. Cobertura ante reclamos de terceros transportados y no transportados.',
    badge: 'Básica',
  },
  TERCEROS_COMPLETO: {
    title: 'Terceros Completo',
    desc: 'Responsabilidad civil, robo o hurto total/parcial, incendio total/parcial y daños por granizo.',
    badge: 'Más Elegida',
  },
  TODO_RIESGO_CON_FRANQUICIA: {
    title: 'Todo Riesgo con Franquicia',
    desc: 'Máxima protección: cubre daños parciales por accidente, cerraduras, cristales, ruedas sin límite y franquicia fija.',
    badge: 'Premium',
  },
};
