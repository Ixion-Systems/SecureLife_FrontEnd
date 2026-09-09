import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
  Home,
  Building2,
  Building,
  Trees,
  Store,
  MapPin,
  Sparkles,
  Layers,
  Flame,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type {
  CotizacionInmuebleFormData,
  TipoInmueble,
  TipoTecho,
} from '../types/cotizacion-inmueble.types';

export interface Paso1UbicacionTipologiaProps {
  register: UseFormRegister<CotizacionInmuebleFormData>;
  errors: FieldErrors<CotizacionInmuebleFormData>;
  watch: UseFormWatch<CotizacionInmuebleFormData>;
  setValue: UseFormSetValue<CotizacionInmuebleFormData>;
  sugeridoEdificio: number;
  onAplicarSugeridos: () => void;
}

interface TipoInmuebleOption {
  id: TipoInmueble;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TIPOS_INMUEBLE: TipoInmuebleOption[] = [
  {
    id: 'CASA',
    title: 'Casa Individual',
    subtitle: 'Vivienda unifamiliar aislada o entre medianeras',
    icon: Home,
  },
  {
    id: 'DEPARTAMENTO',
    title: 'Departamento',
    subtitle: 'Piso o unidad en edificio en propiedad horizontal',
    icon: Building2,
  },
  {
    id: 'PH',
    title: 'PH / Dúplex',
    subtitle: 'Propiedad horizontal sin expensas comunes',
    icon: Building,
  },
  {
    id: 'COUNTRY_BARRIO_CERRADO',
    title: 'Country / Barrio Privado',
    subtitle: 'Urbanización cerrada con control de acceso 24h',
    icon: Trees,
  },
  {
    id: 'LOCAL_COMERCIAL',
    title: 'Local Comercial',
    subtitle: 'Comercio a la calle, oficinas o consultorios',
    icon: Store,
  },
];

interface TipoTechoOption {
  id: TipoTecho;
  label: string;
  desc: string;
}

const TIPOS_TECHO: TipoTechoOption[] = [
  {
    id: 'LOSA_HORMIGON',
    label: 'Losa / Hormigón',
    desc: 'Mayor resistencia ignífuga y climática',
  },
  {
    id: 'CHAPA',
    label: 'Chapa Galvanizada',
    desc: 'Estructura metálica liviana',
  },
  {
    id: 'TEJA',
    label: 'Teja Francesa / Colonial',
    desc: 'Techo tradicional con aislación térmica',
  },
];

export const Paso1UbicacionTipologia: React.FC<Paso1UbicacionTipologiaProps> = ({
  register,
  errors,
  watch,
  setValue,
  sugeridoEdificio,
  onAplicarSugeridos,
}) => {
  const selectedTipo = watch('tipoInmueble');
  const selectedTecho = watch('tipoTecho');
  const superficieM2 = watch('superficieM2');

  return (
    <div className="space-y-6 sm:space-y-8 animate-slide-up text-left">
      {/* 1. Selector Visual de Tipo de Inmueble */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-subtitle font-bold text-sm text-[#0b1c30] flex items-center gap-2">
            <Home className="w-4 h-4 text-[#006e2f]" />
            <span>Tipo de Inmueble a Proteger</span>
            <span className="text-[#22c55e] text-xs font-normal">* Requerido</span>
          </label>
          <Badge variant="glass" className="text-[11px] py-0.5">
            5 Categorías Actuariales
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIPOS_INMUEBLE.map((tipo) => {
            const Icon = tipo.icon;
            const isSelected = selectedTipo === tipo.id;

            return (
              <button
                key={tipo.id}
                type="button"
                onClick={() => {
                  setValue('tipoInmueble', tipo.id, { shouldValidate: true });
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-emerald-50/70 border-[#006e2f] shadow-md shadow-[#006e2f]/10 ring-2 ring-[#22c55e]/40'
                    : 'bg-white/90 hover:bg-white border-gray-200/80 hover:border-gray-300 shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#006e2f] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`font-title text-sm font-bold truncate ${
                      isSelected ? 'text-[#006e2f]' : 'text-[#0b1c30]'
                    }`}
                  >
                    {tipo.title}
                  </p>
                  <p className="font-body text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                    {tipo.subtitle}
                  </p>
                </div>

                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#006e2f]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Ubicación y Dirección del Inmueble */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#006e2f]" />
          <h3 className="font-title text-sm sm:text-base font-bold text-[#0b1c30]">
            Ubicación Geográfica y Dirección Exacta
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Calle */}
          <div className="sm:col-span-8">
            <Input
              label="Calle / Avenida"
              placeholder="Ej: Av. del Libertador"
              {...register('calle')}
              error={errors.calle?.message}
              required
            />
          </div>

          {/* Número */}
          <div className="sm:col-span-4">
            <Input
              label="Número Municipal"
              placeholder="Ej: 4520"
              {...register('numero')}
              error={errors.numero?.message}
              required
            />
          </div>

          {/* Piso */}
          <div className="sm:col-span-3">
            <Input
              label="Piso (opcional)"
              placeholder="Ej: 4"
              {...register('piso')}
              error={errors.piso?.message}
            />
          </div>

          {/* Departamento */}
          <div className="sm:col-span-3">
            <Input
              label="Depto / Unidad"
              placeholder="Ej: B"
              {...register('depto')}
              error={errors.depto?.message}
            />
          </div>

          {/* Código Postal */}
          <div className="sm:col-span-6">
            <Input
              label="Código Postal (C.P.)"
              placeholder="Ej: 1425"
              {...register('codigoPostal')}
              error={errors.codigoPostal?.message}
              helperText="Determina la zona de riesgo meteorológico y robo"
              required
            />
          </div>

          {/* Ciudad */}
          <div className="sm:col-span-6">
            <Input
              label="Ciudad / Localidad"
              placeholder="Ej: Palermo / CABA"
              {...register('ciudad')}
              error={errors.ciudad?.message}
              required
            />
          </div>

          {/* Provincia */}
          <div className="sm:col-span-6">
            <Input
              label="Provincia"
              placeholder="Ej: Buenos Aires"
              {...register('provincia')}
              error={errors.provincia?.message}
              required
            />
          </div>
        </div>
      </div>

      {/* 3. Dimensiones y Antigüedad con Cálculo Sugerido */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#006e2f]" />
            <h3 className="font-title text-sm sm:text-base font-bold text-[#0b1c30]">
              Dimensiones y Características Constructivas
            </h3>
          </div>
          <span className="text-[11px] font-subtitle text-gray-500">
            Base para el valor de reposición a nuevo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Superficie Cubierta */}
          <div className="space-y-2">
            <Input
              label="Superficie Cubierta Total (m²)"
              type="number"
              min={15}
              max={10000}
              placeholder="Ej: 85"
              {...register('superficieM2', { valueAsNumber: true })}
              error={errors.superficieM2?.message}
              required
            />

            {/* Banner dinámico de sugerencia */}
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#006e2f] shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-snug">
                <span className="font-bold">Valor de reposición sugerido:</span>{' '}
                <span className="font-title font-bold text-[#006e2f]">
                  ${sugeridoEdificio.toLocaleString('es-AR')}
                </span>{' '}
                <span className="text-emerald-700">({superficieM2 || 0} m² cubiertos)</span>
                <button
                  type="button"
                  onClick={onAplicarSugeridos}
                  className="inline-flex items-center gap-1 mt-1 font-semibold text-[#006e2f] hover:underline cursor-pointer text-[11px]"
                >
                  <Check className="w-3.5 h-3.5 text-[#006e2f]" />
                  Reajustar sumas aseguradas con este valor
                </button>
              </div>
            </div>
          </div>

          {/* Año de Construcción */}
          <div>
            <Input
              label="Año de Construcción"
              type="number"
              min={1920}
              max={new Date().getFullYear() + 1}
              placeholder="Ej: 2015"
              {...register('anioConstruccion', { valueAsNumber: true })}
              error={errors.anioConstruccion?.message}
              helperText="Inmuebles mayores a 50 años requieren inspección de cañerías e instalación eléctrica"
              required
            />
          </div>
        </div>

        {/* Tipo de Techo */}
        <div className="space-y-2 pt-1">
          <label className="font-subtitle font-bold text-xs text-[#0b1c30] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Tipo de Techo Principal</span>
            <span className="text-[#22c55e] text-[11px] font-normal">* Requerido</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIPOS_TECHO.map((techo) => {
              const isSelected = selectedTecho === techo.id;
              return (
                <button
                  key={techo.id}
                  type="button"
                  onClick={() => setValue('tipoTecho', techo.id, { shouldValidate: true })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#006e2f]/10 border-[#006e2f] text-[#006e2f] font-semibold ring-1 ring-[#006e2f]'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{techo.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{techo.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nota institucional */}
      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-center gap-2.5 text-xs text-blue-900">
        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          Las sumas aseguradas definitivas serán ratificadas conforme a las fotos de fachada y el
          relevamiento pericial digital cargado en el Paso 3.
        </span>
      </div>
    </div>
  );
};
