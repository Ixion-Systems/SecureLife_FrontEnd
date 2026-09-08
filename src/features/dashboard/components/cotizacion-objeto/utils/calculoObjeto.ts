import type {
  CalculoObjetoResultado,
  DesgloseCalculoObjeto,
  TipoObjeto,
} from '../types/cotizacion-objeto.types';

/**
 * Tasas anuales técnicas por tipo de bien
 */
const TASAS_ANUALES: Record<TipoObjeto, number> = {
  SMARTPHONE: 0.024,     // 2.4% anual
  NOTEBOOK: 0.019,       // 1.9% anual
  CAMARA: 0.021,         // 2.1% anual
  MICROMOVILIDAD: 0.028, // 2.8% anual
};

/**
 * Motor actuarial puro para Tecnología y Objetos Personales
 * Aplica franquicia fija del 10% según directriz oficial.
 */
export function calcularCotizacionObjetoLocal(
  tipoObjeto: TipoObjeto = 'SMARTPHONE',
  valorEstimado: number = 1_200_000,
  cubreRobo: boolean = true,
  cubreDanoAccidental: boolean = true,
  cubreLiquidos: boolean = false,
  origen: 'api' | 'fallback_local' = 'fallback_local'
): CalculoObjetoResultado {
  const tasaAnual = TASAS_ANUALES[tipoObjeto] || 0.024;
  const tasaBaseMensual = tasaAnual / 12;

  // Prima base (incluye cobertura de robo express si está activa)
  const primaRoboExpress = cubreRobo ? Math.round(valorEstimado * tasaBaseMensual) : 0;

  // Cobertura de daño accidental (+35% de la prima técnica base)
  const primaDanoAccidental = cubreDanoAccidental
    ? Math.round(valorEstimado * tasaBaseMensual * 0.35)
    : 0;

  // Cobertura de derrame de líquidos (+20% de la prima técnica base)
  const primaDerrameLiquidos = cubreLiquidos
    ? Math.round(valorEstimado * tasaBaseMensual * 0.2)
    : 0;

  const subtotalPrimaTecnica = Math.max(
    1500,
    primaRoboExpress + primaDanoAccidental + primaDerrameLiquidos
  );

  // Franquicia fija obligatoria del 10%
  const franquiciaPct = 10;
  const montoFranquiciaARS = Math.round(valorEstimado * 0.1);

  // Impuestos y sellados (19%)
  const impuestosYSellados = Math.round(subtotalPrimaTecnica * 0.19);
  const primaMensualTotal = subtotalPrimaTecnica + impuestosYSellados;

  const desglose: DesgloseCalculoObjeto = {
    valorReposicion: valorEstimado,
    tasaBasePct: Number((tasaAnual * 100).toFixed(2)),
    primaRoboExpress,
    primaDanoAccidental,
    primaDerrameLiquidos,
    subtotalPrimaTecnica,
    franquiciaPct,
    montoFranquiciaARS,
    impuestosYSellados,
    primaMensualTotal,
  };

  return {
    primaMensualEstimada: primaMensualTotal,
    valorAsegurado: valorEstimado,
    franquiciaFija: montoFranquiciaARS,
    desglose,
    fechaCalculo: new Date().toISOString(),
    origen,
  };
}
