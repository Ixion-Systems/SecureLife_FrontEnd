import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { CotizadorAmbientCanvas } from '@/components/animations/CotizadorAmbientCanvas';
import { useCotizadorAuto } from '@/features/cotizador/hooks/useCotizadorAuto';
import { PasoTitular } from '@/features/cotizador/components/PasoTitular';
import { PasoVehiculo } from '@/features/cotizador/components/PasoVehiculo';
import { PasoCobertura } from '@/features/cotizador/components/PasoCobertura';
import { PasoResumen } from '@/features/cotizador/components/PasoResumen';
import type { WizardStepNumber } from '@/features/cotizador/types/cotizacion-auto.types';

interface StepMeta {
  number: WizardStepNumber;
  title: string;
  subtitle: string;
}

const STEPS_META: StepMeta[] = [
  { number: 1, title: 'Titular', subtitle: 'Datos personales' },
  { number: 2, title: 'Vehículo', subtitle: 'Auto y modelos' },
  { number: 3, title: 'Cobertura', subtitle: 'Planes y extras' },
  { number: 4, title: 'Resumen', subtitle: 'Cotización oficial' },
];

/**
 * CotizadorSection Component
 * 
 * Embedded landing section positioned at the bottom of the page.
 * Features:
 * - Direct real backend calculation via Node.js + Express actuarial engine.
 * - Dynamic Argentine makes and official models selection.
 * - Strict viewport max-height constraint (`max-h-[85vh]`) with internal scroll to avoid screen overflow.
 * - Prominently visible animated ambient canvas.
 * - Zero white-screen crash handling with defensive render fallbacks.
 *
 * @component
 * @layer Feature Component
 * @module features/landing/components/CotizadorSection
 */
export const CotizadorSection: React.FC = () => {
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

  const cardRef = useRef<HTMLDivElement>(null);
  const isLastStep = currentStep === 4;

  const handleScrollToTop = () => {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="cotizador"
      className="min-h-screen flex flex-col justify-center items-center py-20 px-4 sm:px-6 md:px-12 relative overflow-hidden bg-[#f8f9ff]"
    >
      {/* 1. Visible Animated Ambient Canvas Background */}
      <CotizadorAmbientCanvas />

      {/* Decorative Radial Glows for Contrast & Depth */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#006e2f]/10 rounded-full blur-3xl pointer-events-none" />

      {/* 2. Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-8 relative z-10 animate-slide-up">
        <Badge
          variant="primary"
          className="mb-3 font-subtitle text-xs uppercase tracking-wider font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" />
          COTIZADOR ONLINE EN VIVO
        </Badge>
        <h2 className="font-title text-3xl md:text-5xl font-extrabold text-[#0b1c30] tracking-tight mb-2">
          Calculá el seguro de tu auto en segundos
        </h2>
        <p className="font-subtitle text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Cotización oficial en tiempo real procesada por nuestro motor actuarial. Elegí tu vehículo,
          personalizá las coberturas y contratá sin intermediarios.
        </p>
      </div>

      {/* 3. Cotizador Card (Natural full-height without internal scroll) */}
      <div
        ref={cardRef}
        className="w-full max-w-4xl flex flex-col bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl shadow-[#0b1c30]/12 relative z-10"
      >
        {/* Card Header & Brand Bar */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200/70 bg-white/75 backdrop-blur-md rounded-t-3xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#006e2f] to-[#22c55e] flex items-center justify-center p-1.5 shadow-sm">
              <img src="/LOGO.svg" alt="SecureLife" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <h3 className="font-title text-base sm:text-lg font-bold text-[#0b1c30] leading-tight">
                Simulador Actuarial Automotor
              </h3>
              <span className="font-body text-xs text-gray-500">
                SecureLife • Conexión Directa con API de Tasación
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="glass" className="text-[11px] py-1">
              Paso {currentStep} de 4
            </Badge>
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

        {/* Natural Height Form Body */}
        <div className="p-4 sm:p-6 md:p-8 text-left">
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
              onClose={handleScrollToTop}
            />
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-4 sm:px-6 py-4 bg-white/75 backdrop-blur-md border-t border-gray-200/70 rounded-b-3xl flex items-center justify-between shrink-0">
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
                Nueva Cotización
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

      {/* Dynamic Scroll Cue when form extends below viewport */}
      <ScrollIndicator
        text="El formulario sigue debajo"
        watchRef={cardRef}
        scrollAmount={380}
        position="floating"
      />
    </section>
  );
};
