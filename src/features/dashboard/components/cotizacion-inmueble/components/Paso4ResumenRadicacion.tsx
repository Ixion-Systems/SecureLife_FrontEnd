import React from 'react';
import {
  ShieldCheck,
  MapPin,
  Home,
  CheckCircle,
  FileCheck,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type {
  CotizacionInmuebleFormData,
  CalculoInmuebleResultado,
  AsyncRadicacionState,
} from '../types/cotizacion-inmueble.types';

export interface Paso4ResumenRadicacionProps {
  formData: CotizacionInmuebleFormData;
  calculo: CalculoInmuebleResultado | null;
  asyncRadicacion: AsyncRadicacionState;
  onRadicar: () => void;
  onCerrarYVolver: () => void;
}

export const Paso4ResumenRadicacion: React.FC<Paso4ResumenRadicacionProps> = ({
  formData,
  calculo,
  asyncRadicacion,
  onRadicar,
  onCerrarYVolver,
}) => {
  const isSubmitted = asyncRadicacion.status === 'success';
  const isSubmitting = asyncRadicacion.status === 'submitting';
  const resultado = asyncRadicacion.data;

  // -------------------------------------------------------------
  // VISTA DE ÉXITO: PANTALLA POST-RADICACIÓN EXITOSA
  // -------------------------------------------------------------
  if (isSubmitted && resultado) {
    return (
      <div className="py-6 sm:py-10 px-2 sm:px-6 max-w-2xl mx-auto text-center space-y-6 animate-scale-in">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#006e2f] to-[#22c55e] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#006e2f]/25 animate-bounce-short">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <Badge variant="primary" className="text-xs py-1 px-3">
            Radicación Oficial Completada
          </Badge>
          <h3 className="font-title text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
            ¡Cotización Radicada con Éxito!
          </h3>
          <p className="font-body text-sm text-gray-600 max-w-md mx-auto">
            Tu expediente de seguro de hogar fue registrado en la plataforma oficial de SecureLife
            y enviado al equipo actuarial.
          </p>
        </div>

        {/* Tarjeta de Expediente Oficial */}
        <div className="p-6 rounded-3xl bg-white border border-emerald-200/80 shadow-lg text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[11px] font-subtitle uppercase tracking-wider text-gray-400 block">
                Número de Cotización Oficial
              </span>
              <span className="font-title text-xl font-bold text-[#006e2f]">
                {resultado.numeroCotizacion}
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-subtitle uppercase tracking-wider text-gray-400 block">
                Estado Actual
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
                <span>{resultado.estado}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block">Inmueble:</span>
              <span className="font-semibold text-[#0b1c30]">
                {formData.calle} {formData.numero}, {formData.ciudad}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block">Suma Asegurada Total:</span>
              <span className="font-semibold text-[#0b1c30]">
                ${resultado.sumaAseguradaTotal.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-gray-400 block">Prima Mensual Estimada:</span>
              <span className="font-bold text-[#006e2f] text-sm">
                ${resultado.primaMensualFinal.toLocaleString('es-AR')} / mes
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#006e2f]" />
              Próximos Pasos de la Inspección Técnica:
            </p>
            <p className="text-emerald-800 leading-relaxed text-[11px]">
              Un perito técnico revisará las fotografías de fachada, cerrojos y documentación dentro
              de las <strong>24 a 48 hs hábiles</strong>. Una vez aprobada, recibirás la póliza
              digital con firma electrónica en tu panel y correo registrado.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onCerrarYVolver}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto font-title font-bold shadow-lg shadow-[#22c55e]/25"
          >
            Volver a Mi Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VISTA PREVIA: RESUMEN CONSOLIDADO ANTES DE RADICAR
  // -------------------------------------------------------------
  const desglose = calculo?.desglose;

  return (
    <div className="space-y-6 animate-slide-up text-left">
      <div>
        <h3 className="font-title text-base sm:text-lg font-bold text-[#0b1c30] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#006e2f]" />
          <span>Resumen de Cotización y Radicación</span>
        </h3>
        <p className="font-body text-xs text-gray-500">
          Revisa todos los datos declarados antes de radicar la solicitud formal en el sistema de inspección
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Detalle del Inmueble y Seguridad (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Bloque Inmueble */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-title text-xs font-bold text-[#006e2f] uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-4 h-4" /> Tipología e Inmueble
              </span>
              <Badge variant="glass" className="text-[10px] py-0.5">
                {formData.tipoInmueble.replace(/_/g, ' ')}
              </Badge>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-title text-sm font-bold text-[#0b1c30]">
                  {formData.calle} {formData.numero}
                  {formData.piso ? ` - Piso ${formData.piso}` : ''}
                  {formData.depto ? ` Depto ${formData.depto}` : ''}
                </p>
                <p className="font-body text-xs text-gray-500">
                  {formData.ciudad}, {formData.provincia} (C.P. {formData.codigoPostal})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
              <div>
                <span className="text-[10px] text-gray-400 block">Superficie:</span>
                <span className="font-bold text-[#0b1c30]">{formData.superficieM2} m² cubiertos</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Construcción:</span>
                <span className="font-bold text-[#0b1c30]">Año {formData.anioConstruccion}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Techo:</span>
                <span className="font-bold text-[#0b1c30] truncate block">
                  {formData.tipoTecho === 'LOSA_HORMIGON'
                    ? 'Losa'
                    : formData.tipoTecho === 'CHAPA'
                    ? 'Chapa'
                    : 'Teja'}
                </span>
              </div>
            </div>
          </div>

          {/* Bloque Medidas de Seguridad Declaradas */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <span className="font-title text-xs font-bold text-[#006e2f] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Medidas de Seguridad Declaradas
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${
                    formData.alarmaMonitoreada ? 'text-[#22c55e]' : 'text-gray-300'
                  }`}
                />
                <span className={formData.alarmaMonitoreada ? 'text-[#0b1c30] font-semibold' : 'text-gray-400'}>
                  Alarma Monitoreada 24h (-10% OFF)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${
                    formData.rejasPerimetrales ? 'text-[#22c55e]' : 'text-gray-300'
                  }`}
                />
                <span className={formData.rejasPerimetrales ? 'text-[#0b1c30] font-semibold' : 'text-gray-400'}>
                  Rejas Perimetrales (-5% OFF)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${
                    formData.puertaBlindada ? 'text-[#22c55e]' : 'text-gray-300'
                  }`}
                />
                <span className={formData.puertaBlindada ? 'text-[#0b1c30] font-semibold' : 'text-gray-400'}>
                  Puerta Blindada / Multianclaje
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${
                    formData.camarasVigilancia ? 'text-[#22c55e]' : 'text-gray-300'
                  }`}
                />
                <span className={formData.camarasVigilancia ? 'text-[#0b1c30] font-semibold' : 'text-gray-400'}>
                  Cámaras de Videovigilancia
                </span>
              </div>
            </div>
          </div>

          {/* Bloque Documentación Adjunta */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <span className="font-title text-xs font-bold text-[#006e2f] uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" /> Relevamiento Fotográfico y Titularidad
            </span>

            <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
              <span>Documentos e imágenes adjuntadas:</span>
              <span className="font-bold text-[#006e2f]">
                {formData.archivos.length} archivos validados
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Vínculo declarado:{' '}
              <strong className="text-gray-700">
                {formData.tipoDocumentoTitularidad === 'ESCRITURA'
                  ? 'Propietario con Escritura'
                  : formData.tipoDocumentoTitularidad === 'BOLETO_COMPRAVENTA'
                  ? 'Poseedor con Boleto'
                  : 'Inquilino con Contrato'}
              </strong>
            </p>
          </div>
        </div>

        {/* Columna Derecha: Sumas y Liquidación de Prima (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-white to-gray-50/80 border border-gray-200 shadow-md space-y-4">
            <h4 className="font-title text-sm font-bold text-[#0b1c30] border-b border-gray-100 pb-2">
              Sumas y Cuota Mensual
            </h4>

            {/* Sumas */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Edificio:</span>
                <span className="font-semibold text-[#0b1c30]">
                  ${formData.sumaEdificio.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contenido General:</span>
                <span className="font-semibold text-[#0b1c30]">
                  ${formData.sumaContenido.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Electrodomésticos:</span>
                <span className="font-semibold text-[#0b1c30]">
                  ${formData.sumaElectrodomesticos.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Resp. Civil Linderos:</span>
                <span className="font-semibold text-[#0b1c30]">
                  ${formData.sumaRCLinderos.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Desglose Actuarial */}
            {desglose && (
              <div className="pt-3 border-t border-gray-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal Prima Base:</span>
                  <span>${desglose.subtotalPrima.toLocaleString('es-AR')}</span>
                </div>

                {desglose.totalBonificaciones > 0 && (
                  <div className="flex justify-between text-[#006e2f] font-semibold">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> Bonificaciones Seguridad:
                    </span>
                    <span>-${desglose.totalBonificaciones.toLocaleString('es-AR')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>Impuestos (IVA + Sellos):</span>
                  <span>+${desglose.impuestos.toLocaleString('es-AR')}</span>
                </div>
              </div>
            )}

            {/* Cuota Final */}
            <div className="pt-3 border-t-2 border-dashed border-gray-200 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-subtitle font-bold text-gray-500 block">
                  Cuota Mensual Total:
                </span>
                <span className="text-[10px] text-gray-400">Sin costos de emisión</span>
              </div>
              <div className="text-right">
                <span className="font-title text-2xl font-black text-[#006e2f]">
                  ${calculo?.primaMensualEstimada.toLocaleString('es-AR')}
                </span>
                <span className="text-xs text-gray-500 font-semibold block">/ mes</span>
              </div>
            </div>

            {/* Botón Principal de Radicación */}
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                glow
                isLoading={isSubmitting}
                onClick={onRadicar}
                rightIcon={<Send className="w-4 h-4" />}
                className="w-full font-title font-bold py-3 text-sm shadow-lg shadow-[#22c55e]/25"
              >
                {isSubmitting ? 'Radicando en el Sistema...' : 'Radicar Cotización de Inmueble'}
              </Button>
            </div>

            {asyncRadicacion.error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{asyncRadicacion.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
