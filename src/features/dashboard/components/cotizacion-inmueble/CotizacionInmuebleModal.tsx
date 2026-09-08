import React, { useEffect, useCallback } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Home,
  Check,
  FileCheck,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCotizacionInmueble } from './hooks/useCotizacionInmueble';
import { Paso1UbicacionTipologia } from './components/Paso1UbicacionTipologia';
import { Paso2SeguridadCoberturas } from './components/Paso2SeguridadCoberturas';
import { Paso3InspeccionDigital } from './components/Paso3InspeccionDigital';
import { Paso4ResumenRadicacion } from './components/Paso4ResumenRadicacion';
import type { InmuebleWizardStepNumber } from './types/cotizacion-inmueble.types';

export interface CotizacionInmuebleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCotizacionRadicada?: () => void;
}

interface StepMeta {
  number: InmuebleWizardStepNumber;
  title: string;
  subtitle: string;
}

const STEPS_META: StepMeta[] = [
  { number: 1, title: 'Ubicación', subtitle: 'Tipología y m²' },
  { number: 2, title: 'Coberturas', subtitle: 'Seguridad y sumas' },
  { number: 3, title: 'Inspección', subtitle: 'Fotos y títulos' },
  { number: 4, title: 'Radicación', subtitle: 'Resumen oficial' },
];

/**
 * CotizacionInmuebleModal Component
 *
 * Floating modal hosting the 4-step Home & Property Insurance Quoting and Underwriting Wizard.
 * Implements glassmorphism styling, real-time actuarial calculation, photo upload drag & drop,
 * and seamless dispatch to the backend API.
 *
 * @component
 * @layer Presentation / Feature View
 * @module features/dashboard/components/cotizacion-inmueble/CotizacionInmuebleModal
 */
export const CotizacionInmuebleModal: React.FC<CotizacionInmuebleModalProps> = ({
  isOpen,
  onClose,
  onCotizacionRadicada,
}) => {
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    resetWizard,
    register,
    watch,
    setValue,
    errors,
    sugeridoEdificio,
    aplicarValoresSugeridos,
    archivos,
    agregarArchivo,
    eliminarArchivo,
    inspeccionCompleta,
    requiereFotoAlarma,
    asyncCalculo,
    recalcular,
    asyncRadicacion,
    radicarCotizacion,
    form,
  } = useCotizacionInmueble(onCotizacionRadicada);

  // Escape key listener & body scroll lock
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isLastStep = currentStep === 4;
  const isSubmitted = asyncRadicacion.status === 'success';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cotizacion-inmueble-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-scale-in"
    >
      {/* Dark/Blur Glass Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/70 backdrop-blur-md transition-opacity"
        onClick={() => asyncRadicacion.status !== 'submitting' && onClose()}
      />

      {/* Main Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl flex flex-col max-h-[92vh] bg-[#f8f9ff]/98 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl shadow-[#0b1c30]/30 z-10 overflow-hidden my-auto"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-white/90 border-b border-gray-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006e2f] flex items-center justify-center border border-emerald-200/60 shadow-xs">
              <Home className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2
                  id="cotizacion-inmueble-title"
                  className="font-title text-base sm:text-lg font-bold text-[#0b1c30] leading-tight flex items-center gap-2"
                >
                  <span>Cotizador y Radicación de Hogar e Inmuebles</span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold py-0.5 px-2 bg-emerald-100 text-[#006e2f] rounded-full">
                    Oficial
                  </span>
                </h2>
              </div>
              <p className="font-body text-xs text-gray-500">
                Paso {currentStep} de 4: {STEPS_META[currentStep - 1].subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={asyncRadicacion.status === 'submitting'}
            aria-label="Cerrar modal"
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators (Ocultos al radicarse con éxito) */}
        {!isSubmitted && (
          <div className="px-6 py-3.5 bg-white/50 border-b border-gray-100 shrink-0">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
              {STEPS_META.map((step) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div
                    key={step.number}
                    className="flex items-center gap-2 text-left cursor-default"
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        isCompleted
                          ? 'bg-[#22c55e] text-white'
                          : isCurrent
                          ? 'bg-[#006e2f] text-white shadow-md shadow-[#006e2f]/20 ring-2 ring-[#22c55e]/50'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                    </div>

                    <div className="hidden sm:block min-w-0">
                      <p
                        className={`font-subtitle text-xs font-bold truncate ${
                          isCurrent ? 'text-[#006e2f]' : 'text-gray-600'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continuous Progress Bar Line */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#006e2f] to-[#22c55e] h-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 custom-scrollbar min-h-0">
          {currentStep === 1 && (
            <Paso1UbicacionTipologia
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              sugeridoEdificio={sugeridoEdificio}
              onAplicarSugeridos={aplicarValoresSugeridos}
            />
          )}

          {currentStep === 2 && (
            <Paso2SeguridadCoberturas
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              sugeridoEdificio={sugeridoEdificio}
              asyncCalculo={asyncCalculo}
              onRecalcular={recalcular}
            />
          )}

          {currentStep === 3 && (
            <Paso3InspeccionDigital
              watch={watch}
              setValue={setValue}
              archivos={archivos}
              onAgregarArchivo={agregarArchivo}
              onEliminarArchivo={eliminarArchivo}
              inspeccionCompleta={inspeccionCompleta}
              requiereFotoAlarma={requiereFotoAlarma}
              error={errors.archivos?.message}
            />
          )}

          {currentStep === 4 && (
            <Paso4ResumenRadicacion
              formData={form.getValues()}
              calculo={asyncCalculo.data}
              asyncRadicacion={asyncRadicacion}
              onRadicar={radicarCotizacion}
              onCerrarYVolver={() => {
                resetWizard();
                onClose();
              }}
            />
          )}
        </div>

        {/* Modal Footer Controls (Oculto si ya fue radicado y estamos en la pantalla de éxito) */}
        {!isSubmitted && (
          <div className="px-6 py-4 bg-white/90 border-t border-gray-200/80 flex items-center justify-between shrink-0">
            <div>
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousStep}
                  disabled={asyncRadicacion.status === 'submitting'}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="!rounded-xl"
                >
                  {isLastStep ? 'Modificar Datos' : 'Atrás'}
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer px-2 py-1"
                >
                  Cancelar
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isLastStep ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  glow={currentStep === 2 || currentStep === 3}
                  onClick={goToNextStep}
                  rightIcon={
                    currentStep === 3 ? (
                      <FileCheck className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )
                  }
                  className="!rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#22c55e]/25"
                >
                  {currentStep === 1
                    ? 'Continuar al Paso 2'
                    : currentStep === 2
                    ? 'Continuar al Paso 3'
                    : 'Ver Resumen y Radicar'}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  glow
                  isLoading={asyncRadicacion.status === 'submitting'}
                  onClick={radicarCotizacion}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="!rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#22c55e]/25"
                >
                  Radicar Cotización de Inmueble
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
