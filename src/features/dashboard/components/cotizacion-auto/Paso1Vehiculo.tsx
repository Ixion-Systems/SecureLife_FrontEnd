import React from 'react';
import {
  Car,
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import type { VehiculoFormState, CotizacionEstimacionRealTime } from './types';
import type { MarcaOption, ModeloOption } from './useCotizacionAutoWizard';
import { Badge } from '../../../../components/ui/Badge';

export interface Paso1VehiculoProps {
  vehiculo: VehiculoFormState;
  setVehiculo: React.Dispatch<React.SetStateAction<VehiculoFormState>>;
  marcas: MarcaOption[];
  modelos: ModeloOption[];
  isLoadingMarcas: boolean;
  isLoadingModelos: boolean;
  estimacion: CotizacionEstimacionRealTime | null;
  isCalculating: boolean;
  errors: Record<string, string>;
}

export const Paso1Vehiculo: React.FC<Paso1VehiculoProps> = ({
  vehiculo,
  setVehiculo,
  marcas,
  modelos,
  isLoadingMarcas,
  isLoadingModelos,
  estimacion,
  isCalculating,
  errors,
}) => {
  // Años disponibles según modelo seleccionado o rango estándar
  const selectedModeloObj = modelos.find((m) => m.codigo === vehiculo.modeloCodigo);
  const aniosDisponibles =
    selectedModeloObj && selectedModeloObj.aniosDisponibles.length > 0
      ? selectedModeloObj.aniosDisponibles.map((a) => a.anio)
      : [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010];

  const handleToggleManual = (manual: boolean) => {
    setVehiculo((prev) => ({
      ...prev,
      esManual: manual,
      // Si pasa a manual, conservar o resetear valores amigables
      marca: manual ? '' : prev.marca || 'Toyota',
      marcaCodigo: manual ? '' : prev.marcaCodigo || 'toyota',
      modelo: manual ? '' : prev.modelo || 'Corolla',
      modeloCodigo: manual ? '' : prev.modeloCodigo || 'corolla',
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Selector de Modalidad: Catálogo Oficial ACARA vs Carga Manual */}
      <div className="p-4 rounded-2xl bg-white/70 border border-gray-200/80 backdrop-blur-md shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006e2f] flex items-center justify-center border border-emerald-100 shrink-0">
            {vehiculo.esManual ? (
              <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            ) : (
              <Car className="w-5 h-5 text-[#006e2f]" />
            )}
          </div>
          <div>
            <h3 className="font-title text-sm font-bold text-[#0b1c30]">
              {vehiculo.esManual
                ? 'Modo: Carga Manual Especial / Importado / Clásico'
                : 'Modo: Catálogo Oficial Homologado (ACARA)'}
            </h3>
            <p className="font-body text-xs text-gray-500">
              ¿Tu vehículo no figura en la lista de terminales habituales?
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2 self-end sm:self-auto bg-gray-100/80 p-1 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => handleToggleManual(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-subtitle font-bold transition-all cursor-pointer ${
              !vehiculo.esManual
                ? 'bg-[#006e2f] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0b1c30]'
            }`}
          >
            Catálogo
          </button>
          <button
            type="button"
            onClick={() => handleToggleManual(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-subtitle font-bold transition-all cursor-pointer ${
              vehiculo.esManual
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-[#0b1c30]'
            }`}
          >
            Carga Manual
          </button>
        </div>
      </div>

      {/* 2. CAMPOS SEGÚN MODALIDAD */}
      {!vehiculo.esManual ? (
        /* VISTA: CATÁLOGO OFICIAL */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Marca */}
            <div>
              <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
                Marca Automotriz <span className="text-[#006e2f]">*</span>
              </label>
              <div className="relative">
                <select
                  value={vehiculo.marcaCodigo}
                  disabled={isLoadingMarcas}
                  onChange={(e) => {
                    const sel = marcas.find((m) => m.codigo === e.target.value);
                    setVehiculo((prev) => ({
                      ...prev,
                      marcaCodigo: e.target.value,
                      marca: sel ? sel.nombre : e.target.value,
                    }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all cursor-pointer ${
                    errors.marcaCodigo
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
                  }`}
                >
                  <option value="">Seleccionar Marca...</option>
                  {marcas.map((m) => (
                    <option key={m.codigo} value={m.codigo}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                {isLoadingMarcas && (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-3 pointer-events-none" />
                )}
              </div>
              {errors.marcaCodigo && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.marcaCodigo}</p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
                Modelo Oficial <span className="text-[#006e2f]">*</span>
              </label>
              <div className="relative">
                <select
                  value={vehiculo.modeloCodigo}
                  disabled={isLoadingModelos || !vehiculo.marcaCodigo}
                  onChange={(e) => {
                    const sel = modelos.find((m) => m.codigo === e.target.value);
                    setVehiculo((prev) => ({
                      ...prev,
                      modeloCodigo: e.target.value,
                      modelo: sel ? sel.nombre : e.target.value,
                      anio: sel?.aniosDisponibles?.[0]?.anio || prev.anio,
                    }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all cursor-pointer ${
                    errors.modeloCodigo
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
                  } ${!vehiculo.marcaCodigo ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                >
                  <option value="">
                    {isLoadingModelos ? 'Cargando modelos...' : 'Seleccionar Modelo...'}
                  </option>
                  {modelos.map((m) => (
                    <option key={m.codigo} value={m.codigo}>
                      {m.nombre} {m.segmento ? `(${m.segmento})` : ''}
                    </option>
                  ))}
                </select>
                {isLoadingModelos && (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-3 pointer-events-none" />
                )}
              </div>
              {errors.modeloCodigo && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.modeloCodigo}</p>
              )}
            </div>

            {/* Año */}
            <div>
              <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
                Año de Fabricación <span className="text-[#006e2f]">*</span>
              </label>
              <select
                value={vehiculo.anio}
                onChange={(e) =>
                  setVehiculo((prev) => ({ ...prev, anio: Number(e.target.value) }))
                }
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all cursor-pointer ${
                  errors.anio
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
                }`}
              >
                {aniosDisponibles.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.anio && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.anio}</p>
              )}
            </div>
          </div>

          {/* TARJETA DESTACADA: PRECIO PRELIMINAR ESTIMADO EN TIEMPO REAL */}
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-emerald-900 via-[#004b1e] to-[#003816] text-white shadow-lg border border-emerald-500/30">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#22c55e]/20 blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="glass" className="!bg-emerald-500/20 !text-[#4ade80] !border-emerald-400/40 text-[10px] py-0.5 px-2">
                    <Sparkles className="w-3 h-3 mr-1 inline" /> Tarifa Actuarial Preliminar
                  </Badge>
                  {isCalculating && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-200 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Recalculando...
                    </span>
                  )}
                </div>
                <h4 className="font-title text-base sm:text-lg font-bold">
                  {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
                </h4>
                <p className="font-body text-xs text-emerald-100/80">
                  Cálculo algorítmico oficial en base a la tasa pura y factor de riesgo
                </p>
              </div>

              {/* Prima Mensual Estimada Destacada */}
              <div className="text-left sm:text-right bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/15 shrink-0">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-200 block">
                  Prima Mensual Estimada
                </span>
                <span className="font-title text-2xl sm:text-3xl font-black text-white">
                  ${estimacion?.primaMensualEstimada.toLocaleString('es-AR') ?? '---'}
                  <span className="text-xs font-normal text-emerald-200 ml-1">/ mes</span>
                </span>
              </div>
            </div>

            {/* Subvalores: Suma Asegurada y Franquicia */}
            <div className="mt-4 pt-3.5 border-t border-emerald-700/50 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-emerald-300 block text-[11px]">Suma Asegurada</span>
                <span className="font-semibold text-white font-title text-sm">
                  ${estimacion?.sumaAsegurada.toLocaleString('es-AR') ?? '---'}
                </span>
              </div>
              <div>
                <span className="text-emerald-300 block text-[11px]">Franquicia</span>
                <span className="font-semibold text-white font-title text-sm">
                  {estimacion?.franquicia
                    ? `$${estimacion.franquicia.toLocaleString('es-AR')}`
                    : 'Sin Franquicia'}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-emerald-300 block text-[11px]">Impuestos y Tasas SSN</span>
                <span className="font-semibold text-emerald-100 font-title text-sm">
                  Incluidos en cuota mensual
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA: CARGA MANUAL DE MODELO ESPECIAL/IMPORTADO/CLÁSICO */
        <div className="space-y-4">
          {/* Alerta Informativa Obligatoria */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-title font-bold text-amber-950">
                Vehículo Fuera de Catálogo Comercial Estándar
              </p>
              <p className="font-body text-amber-800 leading-relaxed">
                Este vehículo requiere tasación personalizada. Se enviará a <strong>Revisión Extensa</strong> por nuestros peritos técnicos y actuarios especializados (respuesta garantizada en 24 a 48 hs hábiles).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Marca manual */}
            <div>
              <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
                Marca <span className="text-[#006e2f]">*</span>
              </label>
              <input
                type="text"
                value={vehiculo.marca}
                onChange={(e) =>
                  setVehiculo((prev) => ({ ...prev, marca: e.target.value }))
                }
                placeholder="ej. Porsche, Dodge, Volvo..."
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all ${
                  errors.marca
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
                }`}
              />
              {errors.marca && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.marca}</p>
              )}
            </div>

            {/* Modelo manual */}
            <div>
              <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
                Modelo <span className="text-[#006e2f]">*</span>
              </label>
              <input
                type="text"
                value={vehiculo.modelo}
                onChange={(e) =>
                  setVehiculo((prev) => ({ ...prev, modelo: e.target.value }))
                }
                placeholder="ej. 911 Carrera, Charger, XC90..."
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all ${
                  errors.modelo
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
                }`}
              />
              {errors.modelo && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.modelo}</p>
              )}
            </div>

            {/* Versión */}
            <div>
              <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
                Versión / Cilindrada <span className="text-[#006e2f]">*</span>
              </label>
              <input
                type="text"
                value={vehiculo.version}
                onChange={(e) =>
                  setVehiculo((prev) => ({ ...prev, version: e.target.value }))
                }
                placeholder="ej. 3.0 Turbo Tiptronic"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all ${
                  errors.version
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
                }`}
              />
              {errors.version && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.version}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Año manual */}
            <div>
              <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
                Año <span className="text-[#006e2f]">*</span>
              </label>
              <input
                type="number"
                min="1970"
                max={new Date().getFullYear() + 1}
                value={vehiculo.anio || ''}
                onChange={(e) =>
                  setVehiculo((prev) => ({ ...prev, anio: Number(e.target.value) }))
                }
                placeholder="ej. 2021"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all ${
                  errors.anio
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
                }`}
              />
              {errors.anio && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.anio}</p>
              )}
            </div>

            {/* Valor Estimado Declarado */}
            <div>
              <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
                Valor Estimado Declarado ($ ARS) <span className="text-[#006e2f]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm font-semibold">$</span>
                <input
                  type="number"
                  min="500000"
                  step="100000"
                  value={vehiculo.valorDeclarado}
                  onChange={(e) =>
                    setVehiculo((prev) => ({
                      ...prev,
                      valorDeclarado: e.target.value ? Number(e.target.value) : '',
                    }))
                  }
                  placeholder="ej. 45000000"
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all ${
                    errors.valorDeclarado
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
                  }`}
                />
              </div>
              {errors.valorDeclarado && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.valorDeclarado}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. CAMPOS COMUNES: PATENTE Y CÓDIGO POSTAL DE GUARDA HABITUAL */}
      <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4">
        <h4 className="font-subtitle text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#006e2f]" /> Identificación y Radicación
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Patente */}
          <div>
            <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
              Dominio / Chapa Patente <span className="text-[#006e2f]">*</span>
            </label>
            <input
              type="text"
              maxLength={9}
              value={vehiculo.patente}
              onChange={(e) =>
                setVehiculo((prev) => ({
                  ...prev,
                  patente: e.target.value.toUpperCase().replace(/\s+/g, ''),
                }))
              }
              placeholder="ej. AF123CD o AB123CD"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm font-mono uppercase tracking-widest text-[#0b1c30] outline-none transition-all ${
                errors.patente
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
              }`}
            />
            {errors.patente ? (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.patente}</p>
            ) : (
              <p className="text-[11px] text-gray-500 mt-1">Formato Mercosur (AF123CD) o Tradicional (ABC123)</p>
            )}
          </div>

          {/* Código Postal */}
          <div>
            <label className="block font-subtitle text-xs font-bold text-[#0b1c30] mb-1.5">
              Código Postal de Guarda Habitual <span className="text-[#006e2f]">*</span>
            </label>
            <input
              type="text"
              maxLength={8}
              value={vehiculo.codigoPostal}
              onChange={(e) =>
                setVehiculo((prev) => ({ ...prev, codigoPostal: e.target.value }))
              }
              placeholder="ej. 1425 (CABA), 1642 (San Isidro)"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl font-body text-sm text-[#0b1c30] outline-none transition-all ${
                errors.codigoPostal
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15'
              }`}
            />
            {errors.codigoPostal ? (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.codigoPostal}</p>
            ) : (
              <p className="text-[11px] text-gray-500 mt-1">Afecta el factor de riesgo postal y tarifa base</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
