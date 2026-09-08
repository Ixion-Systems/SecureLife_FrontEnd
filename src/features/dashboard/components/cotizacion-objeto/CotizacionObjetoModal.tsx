import React, { useEffect, useCallback } from 'react';
import {
  X,
  Smartphone,
  Tag,
  Camera,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCotizacionObjeto } from './hooks/useCotizacionObjeto';
import { Paso1TipologiaBien } from './components/Paso1TipologiaBien';
import { Paso2IdentificacionValuacion } from './components/Paso2IdentificacionValuacion';
import { Paso3InspeccionComprobantes } from './components/Paso3InspeccionComprobantes';
import { Paso4CoberturasRadicacion } from './components/Paso4CoberturasRadicacion';
import type { ObjetoWizardStepNumber } from './types/cotizacion-objeto.types';

export interface CotizacionObjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface StepMeta {
  number: ObjetoWizardStepNumber;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS_META: StepMeta[] = [
  { number: 1, title: 'Tipología', subtitle: 'Clase de Dispositivo', icon: Smartphone },
  { number: 2, title: 'Identificación', subtitle: 'Marca, IMEI y Valuación', icon: Tag },
  { number: 3, title: 'Inspección', subtitle: 'Fotos y Comprobantes', icon: Camera },
  { number: 4, title: 'Cobertura', subtitle: 'Franquicia 10% y Póliza', icon: ShieldCheck },
];

/**
 * CotizacionObjetoModal Component
 *
 * Floating modal wizard for Personal Technology and Equipment Insurance.
 * Features 4-step underwriting, strict 15-digit IMEI verification for smartphones,
 * digital photo evidence inspection, 10% fixed deductible calculation, and official policy binding.
 *
 * @component
 * @layer Presentation / Feature View
 * @module features/dashboard/components/cotizacion-objeto/CotizacionObjetoModal
 */
export const CotizacionObjetoModal: React.FC<CotizacionObjetoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    register,
    watch,
    setValue,
    errors,
    stepError,
    archivos,
    agregarArchivo,
    eliminarArchivo,
    simularCargaTodos,
    asyncCalculo,
    asyncRadicacion,
    radicarCotizacion,
    resetWizard,
  } = useCotizacionObjeto(onSuccess);

  // ESC key listener & body scroll lock
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && asyncRadicacion.status !== 'submitting') {
        onClose();
      }
    },
    [onClose, asyncRadicacion.status]
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
      aria-labelledby="cotizacion-objeto-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-scale-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/70 backdrop-blur-md transition-opacity"
        onClick={() => asyncRadicacion.status !== 'submitting' && onClose()}
      />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl flex flex-col max-h-[92vh] bg-[#f8f9ff]/98 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl shadow-[#0b1c30]/30 z-10 overflow-hidden my-auto"
      >
        {/* =========================================================================
            HEADER FIJO
           ========================================================================= */}
        <div className="px-6 py-4 bg-white/90 border-b border-gray-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2
                id="cotizacion-objeto-title"
                className="font-title text-base sm:text-lg font-bold text-[#0b1c30] leading-tight flex items-center gap-2"
              >
                <span>Cotización de Tecnología y Objetos Personales</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold py-0.5 px-2 bg-amber-100 text-amber-800 rounded-full">
                  Cotejo IMEI Digital
                </span>
              </h2>
              <p className="font-body text-xs text-gray-500">
                Paso {currentStep} de 4: {STEPS_META[currentStep - 1].subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={asyncRadicacion.status === 'submitting'}
            aria-label="Cerrar asistente"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================================
            STEPPER / WIZARD INDICATOR
           ========================================================================= */}
        {!isSubmitted && (
          <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-200/60 shrink-0">
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {STEPS_META.map((item) => {
                const isCurrent = currentStep === item.number;
                const isCompleted = currentStep > item.number;
                const IconComponent = item.icon;

                return (
                  <div
                    key={item.number}
                    className={`flex items-center gap-2 sm:gap-2.5 transition-all ${
                      isCurrent
                        ? 'text-[#006e2f]'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-[#006e2f] text-white shadow-xs ring-2 ring-[#006e2f]/20'
                          : isCompleted
                          ? 'bg-emerald-100 text-[#006e2f]'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <IconComponent className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="hidden sm:block text-left min-w-0">
                      <span className="font-title text-xs font-bold block truncate leading-tight">
                        {item.title}
                      </span>
                      <span className="font-body text-[10px] text-gray-400 block truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barra de Progreso Continua */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#006e2f] to-[#22c55e] h-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            SCROLL INTERNO FLUIDO
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 custom-scrollbar min-h-0">
          {currentStep === 1 && (
            <Paso1TipologiaBien watch={watch} setValue={setValue} />
          )}

          {currentStep === 2 && (
            <Paso2IdentificacionValuacion
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              stepError={stepError}
            />
          )}

          {currentStep === 3 && (
            <Paso3InspeccionComprobantes
              tipoObjeto={watch('tipoObjeto')}
              archivos={archivos}
              onAgregarArchivo={agregarArchivo}
              onEliminarArchivo={eliminarArchivo}
              onSimularCargaTodos={simularCargaTodos}
              stepError={stepError}
            />
          )}

          {currentStep === 4 && (
            <Paso4CoberturasRadicacion
              errors={errors}
              watch={watch}
              setValue={setValue}
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

        {/* =========================================================================
            FOOTER FIJO CON NAVEGACIÓN
           ========================================================================= */}
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
                  glow={currentStep === 3}
                  onClick={goToNextStep}
                  rightIcon={
                    currentStep === 3 ? (
                      <FileCheck className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )
                  }
                  className="!rounded-xl !px-6"
                >
                  {currentStep === 3 ? 'Ver Resumen y Franquicia' : 'Continuar'}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
