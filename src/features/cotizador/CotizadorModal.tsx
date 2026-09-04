import React, { useEffect, useCallback } from 'react';
import { X, ArrowLeft, ArrowRight, Calculator, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCotizadorAuto } from './hooks/useCotizadorAuto';
import { PasoTitular } from './components/PasoTitular';
import { PasoVehiculo } from './components/PasoVehiculo';
import { PasoCobertura } from './components/PasoCobertura';
import { PasoResumen } from './components/PasoResumen';
import type { WizardStepNumber } from './types/cotizacion-auto.types';

export interface CotizadorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepMeta {
  number: WizardStepNumber;
  title: string;
  subtitle: string;
}

const STEPS_META: StepMeta[] = [
  { number: 1, title: 'Titular', subtitle: 'Datos personales' },
  { number: 2, title: 'Vehículo', subtitle: 'Detalles del auto' },
  { number: 3, title: 'Cobertura', subtitle: 'Planes y extras' },
  { number: 4, title: 'Resumen', subtitle: 'Cotización final' },
];

/**
 * CotizadorModal Component
 * 
 * Floating modal dialog hosting the 4-step Auto Insurance Quoting Wizard.
 * Implements glassmorphism styling, step progress indicators, accessible keyboard
 * controls (Escape to close), safe backdrop click handling, and state encapsulation.
 *
 * @component
 * @layer Presentation / Feature View
 * @module features/cotizador/CotizadorModal
 * 
 * @param {CotizadorModalProps} props - Component properties.
 * @returns {React.ReactElement | null} Modal element if open, null otherwise.
 */
export const CotizadorModal: React.FC<CotizadorModalProps> = ({ isOpen, onClose }) => {
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetWizard,
    register,
    watch,
    setValue,
    errors,
    conductoresFields,
    addConductor,
    removeConductor,
    asyncState,
    recalcular,
    form,
  } = useCotizadorAuto();

  // Escape key listener & scroll lock
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cotizador-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-scale-in"
    >
      {/* Dark/Blur Glass Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#f8f9ff]/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-2xl shadow-[#0b1c30]/25 overflow-hidden z-10 my-auto"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-gray-200/70 bg-white/70 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#006e2f] to-[#22c55e] flex items-center justify-center p-1.5 shadow-sm">
              <img src="/LOGO.svg" alt="SecureLife" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <h2 id="cotizador-title" className="font-title text-base sm:text-lg font-bold text-[#0b1c30] leading-tight">
                Cotizador de Seguro Automotor
              </h2>
              <span className="font-body text-xs text-gray-500">
                SecureLife • Emisión 100% Digital e Inmediata
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="glass" className="hidden sm:inline-flex text-[11px] py-1">
              Paso {currentStep} de 4
            </Badge>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 py-3.5 bg-white/40 border-b border-gray-100 shrink-0">
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
          <div className="w-full bg-gray-200 h-1 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#006e2f] to-[#22c55e] h-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow custom-scrollbar">
          {currentStep === 1 && (
            <PasoTitular register={register} errors={errors} />
          )}

          {currentStep === 2 && (
            <PasoVehiculo
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          )}

          {currentStep === 3 && (
            <PasoCobertura
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              conductoresFields={conductoresFields}
              addConductor={addConductor}
              removeConductor={removeConductor}
            />
          )}

          {currentStep === 4 && (
            <PasoResumen
              formData={form.getValues()}
              asyncState={asyncState}
              onRetry={recalcular}
              onReset={() => goToStep(1)}
              onClose={onClose}
            />
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-white/70 backdrop-blur-md border-t border-gray-200/70 flex items-center justify-between shrink-0">
          <div>
            {currentStep > 1 && !isLastStep && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="text-xs font-semibold border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Atrás
              </Button>
            )}

            {isLastStep && (
              <Button
                type="button"
                variant="glass"
                size="sm"
                onClick={resetWizard}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="text-xs text-gray-600"
              >
                Modificar Datos
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isLastStep && (
              <Button
                type="button"
                variant="primary"
                size="md"
                glow={currentStep === 3}
                onClick={goToNextStep}
                rightIcon={
                  currentStep === 3 ? (
                    <Calculator className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )
                }
                className="text-xs sm:text-sm font-bold shadow-md shadow-[#22c55e]/25"
              >
                {currentStep === 3 ? 'Calcular Cotización' : 'Siguiente Paso'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
