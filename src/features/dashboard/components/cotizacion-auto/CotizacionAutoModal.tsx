import React, { useEffect, useCallback } from 'react';
import {
  X,
  Car,
  Shield,
  FileCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useCotizacionAutoWizard } from './useCotizacionAutoWizard';
import { Paso1Vehiculo } from './Paso1Vehiculo';
import { Paso2CoberturaExtras } from './Paso2CoberturaExtras';
import { Paso3InspeccionDocumentos } from './Paso3InspeccionDocumentos';
import { Paso4ResumenRadicacion } from './Paso4ResumenRadicacion';
import { Button } from '../../../../components/ui/Button';

export interface CotizacionAutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const STEP_LABELS = [
  { step: 1, title: 'Vehículo', desc: 'Datos del Rodado', icon: Car },
  { step: 2, title: 'Cobertura', desc: 'Planes y Extras', icon: Shield },
  { step: 3, title: 'Inspección', desc: 'Fotos y Documentos', icon: FileCheck },
  { step: 4, title: 'Radicación', desc: 'Resumen Oficial', icon: CheckCircle },
];

/**
 * CotizacionAutoModal Component
 *
 * Responsive 4-step floating wizard with glassmorphism styling and SecureLife brand tokens.
 * Handles automotive quoting for standard catalog vs manual valuation, digital inspection photos,
 * official documents, and SSL registration.
 *
 * @component
 * @layer Presentation / Feature Component
 * @module features/dashboard/components/cotizacion-auto/CotizacionAutoModal
 */
export const CotizacionAutoModal: React.FC<CotizacionAutoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const wizard = useCotizacionAutoWizard(onSuccess);

  // ESC key listener & body scroll lock
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !wizard.isSubmitting) {
        onClose();
      }
    },
    [onClose, wizard.isSubmitting]
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

  const handleFinishAndClose = () => {
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cotizacion-auto-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-scale-in"
    >
      {/* Backdrop con desenfoque de alta gama */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/70 backdrop-blur-md transition-opacity"
        onClick={() => !wizard.isSubmitting && onClose()}
      />

      {/* Contenedor del Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl flex flex-col max-h-[92vh] bg-[#f8f9ff]/98 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl shadow-[#0b1c30]/30 z-10 overflow-hidden my-auto"
      >
        {/* =========================================================================
            HEADER: TÍTULO, SUBTÍTULO Y BOTÓN CERRAR
           ========================================================================= */}
        <div className="px-6 py-4 bg-white/90 border-b border-gray-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006e2f] flex items-center justify-center border border-emerald-200/60 shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="cotizacion-auto-title"
                className="font-title text-base sm:text-lg font-bold text-[#0b1c30] leading-tight flex items-center gap-2"
              >
                <span>Cotización de Seguro Automotor</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold py-0.5 px-2 bg-emerald-100 text-[#006e2f] rounded-full">
                  Oficial
                </span>
              </h2>
              <p className="font-body text-xs text-gray-500">
                Paso {wizard.currentStep} de 4: {STEP_LABELS[wizard.currentStep - 1].desc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={wizard.isSubmitting}
            aria-label="Cerrar asistente"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================================
            STEPPER / WIZARD STEP INDICATORS (PASO 1 A 4)
           ========================================================================= */}
        {!wizard.radicadoResultado && (
          <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-200/60 shrink-0">
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {STEP_LABELS.map((item) => {
                const isCurrent = wizard.currentStep === item.step;
                const isCompleted = wizard.currentStep > item.step;

                return (
                  <div
                    key={item.step}
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
                      ) : isCurrent ? (
                        <item.icon className="w-3.5 h-3.5" />
                      ) : (
                        item.step
                      )}
                    </div>

                    <div className="hidden sm:block text-left min-w-0">
                      <span className="font-title text-xs font-bold block truncate leading-tight">
                        {item.title}
                      </span>
                      <span className="font-body text-[10px] text-gray-400 block truncate">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            CUERPO SCROLLABLE DEL ASISTENTE
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-7 space-y-6">
          {wizard.currentStep === 1 && (
            <Paso1Vehiculo
              vehiculo={wizard.vehiculo}
              setVehiculo={wizard.setVehiculo}
              marcas={wizard.marcas}
              modelos={wizard.modelos}
              isLoadingMarcas={wizard.isLoadingMarcas}
              isLoadingModelos={wizard.isLoadingModelos}
              estimacion={wizard.estimacion}
              isCalculating={wizard.isCalculating}
              errors={wizard.errors}
            />
          )}

          {wizard.currentStep === 2 && (
            <Paso2CoberturaExtras
              cobertura={wizard.cobertura}
              setCobertura={wizard.setCobertura}
              handleAddConductor={wizard.handleAddConductor}
              handleUpdateConductor={wizard.handleUpdateConductor}
              handleRemoveConductor={wizard.handleRemoveConductor}
              errors={wizard.errors}
            />
          )}

          {wizard.currentStep === 3 && (
            <Paso3InspeccionDocumentos
              slots={wizard.inspeccionSlots}
              onUploadSlot={wizard.handleUploadSlot}
              onRemoveSlot={wizard.handleRemoveSlot}
              onSimularTodos={wizard.handleSimularTodosLosArchivos}
              completitud={wizard.completitudInspeccion}
              errors={wizard.errors}
            />
          )}

          {wizard.currentStep === 4 && (
            <Paso4ResumenRadicacion
              vehiculo={wizard.vehiculo}
              cobertura={wizard.cobertura}
              titular={wizard.titular}
              setTitular={wizard.setTitular}
              estimacion={wizard.estimacion}
              inspeccionSlots={wizard.inspeccionSlots}
              radicadoResultado={wizard.radicadoResultado}
              isSubmitting={wizard.isSubmitting}
              submitError={wizard.submitError}
              onRadicar={wizard.radicarCotizacion}
              onVolverDashboard={handleFinishAndClose}
            />
          )}
        </div>

        {/* =========================================================================
            FOOTER CON NAVEGACIÓN (VOLVER / CONTINUAR)
           ========================================================================= */}
        {!wizard.radicadoResultado && (
          <div className="px-6 py-4 bg-white/90 border-t border-gray-200/80 flex items-center justify-between shrink-0">
            <div>
              {wizard.currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={wizard.goToPreviousStep}
                  disabled={wizard.isSubmitting}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="!rounded-xl"
                >
                  Atrás
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
              {wizard.currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={wizard.goToNextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="!rounded-xl"
                >
                  Continuar al Paso {wizard.currentStep + 1}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={wizard.radicarCotizacion}
                  isLoading={wizard.isSubmitting}
                  leftIcon={<Shield className="w-4 h-4" />}
                  className="!rounded-xl"
                >
                  Radicar Solicitud Oficial
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
