import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import {
  ShieldCheck,
  Bell,
  Grid,
  KeyRound,
  Video,
  Home,
  Tv,
  Users,
  Sparkles,
  TrendingDown,
  RotateCcw,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type {
  CotizacionInmuebleFormData,
  AsyncCalculoState,
} from '../types/cotizacion-inmueble.types';

export interface Paso2SeguridadCoberturasProps {
  register: UseFormRegister<CotizacionInmuebleFormData>;
  errors: FieldErrors<CotizacionInmuebleFormData>;
  watch: UseFormWatch<CotizacionInmuebleFormData>;
  setValue: UseFormSetValue<CotizacionInmuebleFormData>;
  sugeridoEdificio: number;
  asyncCalculo: AsyncCalculoState;
  onRecalcular: () => void;
}

export const Paso2SeguridadCoberturas: React.FC<Paso2SeguridadCoberturasProps> = ({
  register,
  errors,
  watch,
  setValue,
  sugeridoEdificio,
  asyncCalculo,
  onRecalcular,
}) => {
  const alarmaMonitoreada = watch('alarmaMonitoreada');
  const rejasPerimetrales = watch('rejasPerimetrales');
  const puertaBlindada = watch('puertaBlindada');
  const camarasVigilancia = watch('camarasVigilancia');

  const sumaEdificio = watch('sumaEdificio');
  const sumaContenido = watch('sumaContenido');
  const sumaElectrodomesticos = watch('sumaElectrodomesticos');
  const sumaRCLinderos = watch('sumaRCLinderos');

  const calculo = asyncCalculo.data;
  const isCalculating = asyncCalculo.status === 'calculating';

  return (
    <div className="space-y-6 sm:space-y-8 animate-slide-up text-left">
      {/* 1. Medidas de Seguridad con Descuentos */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="font-title text-base font-bold text-[#0b1c30] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#006e2f]" />
              <span>Medidas de Seguridad y Prevención</span>
            </h3>
            <p className="font-body text-xs text-gray-500">
              Activa las protecciones instaladas para acceder a bonificaciones sobre la prima mensual
            </p>
          </div>
          <Badge variant="primary" className="self-start sm:self-auto text-xs py-0.5">
            Hasta 25% de Ahorro
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Switch 1: Alarma Monitoreada */}
          <div
            onClick={() => setValue('alarmaMonitoreada', !alarmaMonitoreada, { shouldValidate: true })}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
              alarmaMonitoreada
                ? 'bg-emerald-50/70 border-[#006e2f] shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  alarmaMonitoreada ? 'bg-[#006e2f] text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-title text-sm font-bold text-[#0b1c30]">
                    Alarma monitoreada 24h
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22c55e]/20 text-[#006e2f] border border-[#22c55e]/30">
                    -10% OFF en robo
                  </span>
                </div>
                <p className="font-body text-[11px] text-gray-500">
                  Conexión con central de monitoreo o botón de pánico
                </p>
              </div>
            </div>

            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                alarmaMonitoreada ? 'bg-[#006e2f]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  alarmaMonitoreada ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Switch 2: Rejas perimetrales */}
          <div
            onClick={() => setValue('rejasPerimetrales', !rejasPerimetrales, { shouldValidate: true })}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
              rejasPerimetrales
                ? 'bg-emerald-50/70 border-[#006e2f] shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  rejasPerimetrales ? 'bg-[#006e2f] text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-title text-sm font-bold text-[#0b1c30]">
                    Rejas en aberturas
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22c55e]/20 text-[#006e2f] border border-[#22c55e]/30">
                    -5% OFF
                  </span>
                </div>
                <p className="font-body text-[11px] text-gray-500">
                  En ventanas a la calle y balcones bajos
                </p>
              </div>
            </div>

            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                rejasPerimetrales ? 'bg-[#006e2f]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  rejasPerimetrales ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Switch 3: Puerta Blindada / Multianclaje */}
          <div
            onClick={() => setValue('puertaBlindada', !puertaBlindada, { shouldValidate: true })}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
              puertaBlindada
                ? 'bg-emerald-50/70 border-[#006e2f] shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  puertaBlindada ? 'bg-[#006e2f] text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-title text-sm font-bold text-[#0b1c30]">
                    Puerta blindada / Cerrojo
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Multianclaje
                  </span>
                </div>
                <p className="font-body text-[11px] text-gray-500">
                  Hoja maciza o chapa con cerradura de 4 o más pernos
                </p>
              </div>
            </div>

            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                puertaBlindada ? 'bg-[#006e2f]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  puertaBlindada ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Switch 4: Cámaras de videovigilancia */}
          <div
            onClick={() => setValue('camarasVigilancia', !camarasVigilancia, { shouldValidate: true })}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
              camarasVigilancia
                ? 'bg-emerald-50/70 border-[#006e2f] shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  camarasVigilancia ? 'bg-[#006e2f] text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-title text-sm font-bold text-[#0b1c30]">
                    Cámaras de vigilancia
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    CCTV / IP
                  </span>
                </div>
                <p className="font-body text-[11px] text-gray-500">
                  Grabación continua o visualización remota en el móvil
                </p>
              </div>
            </div>

            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                camarasVigilancia ? 'bg-[#006e2f]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  camarasVigilancia ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sumas Aseguradas a Cotizar */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-title text-base font-bold text-[#0b1c30]">
              Sumas Aseguradas Solicitadas
            </h3>
            <p className="font-body text-xs text-gray-500">
              Valores máximos de indemnización por reposición a nuevo sin franquicia
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setValue('sumaEdificio', sugeridoEdificio, { shouldValidate: true });
              setValue('sumaContenido', Math.round(sugeridoEdificio * 0.3), { shouldValidate: true });
              setValue('sumaElectrodomesticos', Math.round(sugeridoEdificio * 0.15), { shouldValidate: true });
              setValue('sumaRCLinderos', 20000000, { shouldValidate: true });
            }}
            className="text-xs font-semibold text-[#006e2f] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer sugeridos</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Suma Edificio */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-title text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[#006e2f]" /> Edificio (Estructura)
              </span>
              <span className="text-[10px] text-gray-400">Sugerido: ${sugeridoEdificio.toLocaleString('es-AR')}</span>
            </div>
            <Input
              type="number"
              min={5000000}
              step={500000}
              placeholder="Ej: 95000000"
              {...register('sumaEdificio', { valueAsNumber: true })}
              error={errors.sumaEdificio?.message}
              inputSize="sm"
            />
            <p className="text-[11px] text-gray-500">
              Ampara incendio, explosión, impacto de rayos, caída de aeronaves y granizo.
            </p>
          </div>

          {/* Suma Contenido */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-title text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Contenido General
              </span>
              <span className="text-[10px] text-gray-400">30% del valor edilicio</span>
            </div>
            <Input
              type="number"
              min={1000000}
              step={200000}
              placeholder="Ej: 28000000"
              {...register('sumaContenido', { valueAsNumber: true })}
              error={errors.sumaContenido?.message}
              inputSize="sm"
            />
            <p className="text-[11px] text-gray-500">
              Mobiliario, indumentaria, ropa blanca y objetos de uso doméstico.
            </p>
          </div>

          {/* Suma Electrodomésticos y Tecnología */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-title text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-purple-600" /> Electrodomésticos y Tech
              </span>
              <span className="text-[10px] text-gray-400">15% del valor edilicio</span>
            </div>
            <Input
              type="number"
              min={500000}
              step={100000}
              placeholder="Ej: 14000000"
              {...register('sumaElectrodomesticos', { valueAsNumber: true })}
              error={errors.sumaElectrodomesticos?.message}
              inputSize="sm"
            />
            <p className="text-[11px] text-gray-500">
              Smart TVs, notebooks, heladeras, lavarropas y daño por sobretensión eléctrica.
            </p>
          </div>

          {/* Suma Responsabilidad Civil Linderos */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-title text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" /> Resp. Civil hacia Linderos
              </span>
              <span className="text-[10px] text-gray-400">Mínimo sugerido $20M</span>
            </div>
            <Input
              type="number"
              min={5000000}
              step={1000000}
              placeholder="Ej: 20000000"
              {...register('sumaRCLinderos', { valueAsNumber: true })}
              error={errors.sumaRCLinderos?.message}
              inputSize="sm"
            />
            <p className="text-[11px] text-gray-500">
              Daños a vecinos por escape de agua, fuego originado en el inmueble o derrumbe.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Tarjeta Interactiva: PRECIO PRELIMINAR ESTIMADO (Consulta en vivo) */}
      <div className="pt-2 border-t border-gray-100">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1c30] via-[#092b1a] to-[#004b1e] text-white p-5 sm:p-7 shadow-xl">
          {/* Fondo estético */}
          <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-48 h-48 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Cálculo Actuarial en Vivo</span>
                </span>
                {isCalculating && (
                  <span className="text-xs text-emerald-200 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Actualizando...
                  </span>
                )}
              </div>

              <h4 className="font-title text-xl sm:text-2xl font-black tracking-tight">
                Precio Preliminar Estimado
              </h4>
              <p className="font-body text-xs text-emerald-100/80 leading-relaxed">
                Calculado en base a $
                {((sumaEdificio || 0) + (sumaContenido || 0) + (sumaElectrodomesticos || 0) + (sumaRCLinderos || 0)).toLocaleString(
                  'es-AR'
                )}{' '}
                en suma asegurada total y las medidas de prevención declaradas.
              </p>
            </div>

            {/* Precio destacado */}
            <div className="text-left md:text-right shrink-0 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
              <span className="text-[11px] font-subtitle uppercase tracking-wider text-emerald-200 block">
                Cuota Mensual Final
              </span>
              <div className="flex items-baseline md:justify-end gap-1 my-1">
                <span className="font-title text-3xl sm:text-4xl font-extrabold text-white">
                  ${calculo?.primaMensualEstimada ? calculo.primaMensualEstimada.toLocaleString('es-AR') : '...'}
                </span>
                <span className="text-xs text-emerald-200 font-semibold">/ mes</span>
              </div>
              <span className="text-[10px] text-white/70 block">
                Incluye IVA (21%) + Tasas Superintendencia de Seguros
              </span>
            </div>
          </div>

          {/* Desglose de Prima, Impuestos y Bonificaciones */}
          {calculo && (
            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-white/70">Subtotal Prima:</span>
                <p className="font-bold font-title text-sm">
                  ${calculo.desglose.subtotalPrima.toLocaleString('es-AR')}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-white/70 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-[#22c55e]" /> Ahorro Seguridad:
                </span>
                <p className="font-bold font-title text-sm text-[#22c55e]">
                  -${calculo.desglose.totalBonificaciones.toLocaleString('es-AR')}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-white/70">Impuestos (26%):</span>
                <p className="font-bold font-title text-sm">
                  +${calculo.desglose.impuestos.toLocaleString('es-AR')}
                </p>
              </div>

              <div className="space-y-1 flex items-end justify-start sm:justify-end">
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={onRecalcular}
                  disabled={isCalculating}
                  leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />}
                  className="!text-white !border-white/30 !py-1 !px-2.5 !text-[11px]"
                >
                  Recalcular
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          En el siguiente paso podrás cargar las fotografías de las medidas de seguridad y fachada
          para que el equipo pericial apruebe la bonificación formal.
        </span>
      </div>
    </div>
  );
};
