import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type {
  CotizacionAutoFormData,
} from '../types/cotizacion-auto.types';
import { CoberturaCardList } from './CoberturaCardList';
import { ConductoresFormArray } from './ConductoresFormArray';

export interface PasoCoberturaProps {
  register: UseFormRegister<CotizacionAutoFormData>;
  errors: FieldErrors<CotizacionAutoFormData>;
  watch: UseFormWatch<CotizacionAutoFormData>;
  setValue: UseFormSetValue<CotizacionAutoFormData>;
  conductoresFields: Array<{ id: string }>;
  addConductor: () => void;
  removeConductor: (index: number) => void;
}

/**
 * PasoCobertura Component
 * 
 * Step 3 of the Auto Insurance Quoting Wizard.
 * Orchestrates coverage tier selection and additional driver list
 * by composing focused subcomponents (CoberturaCardList, ConductoresFormArray).
 *
 * @component
 * @layer Presentation / Feature Component
 * @module features/cotizador/components/PasoCobertura
 * 
 * @param {PasoCoberturaProps} props - Component properties.
 * @returns {React.ReactElement} Form step view for coverage and additional drivers.
 */
export const PasoCobertura: React.FC<PasoCoberturaProps> = ({
  register,
  errors,
  watch,
  setValue,
  conductoresFields,
  addConductor,
  removeConductor,
}) => {
  const selectedCobertura = watch('coberturaSolicitada');

  return (
    <div className="space-y-7 animate-slide-up">
      {/* Step Header */}
      <div className="text-left">
        <h3 className="font-title text-xl md:text-2xl font-bold text-[#0b1c30]">
          Elige el Nivel de Cobertura
        </h3>
        <p className="font-subtitle text-sm text-gray-600 mt-1">
          Selecciona el plan que mejor se adapte a tus hábitos de conducción y necesidades de protección.
        </p>
      </div>

      {/* Coverage Tier Cards Grid */}
      <CoberturaCardList
        selectedCobertura={selectedCobertura}
        onSelect={(tipo) => setValue('coberturaSolicitada', tipo, { shouldValidate: true })}
      />

      {/* Designated Additional Drivers Section */}
      <ConductoresFormArray
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        conductoresFields={conductoresFields}
        addConductor={addConductor}
        removeConductor={removeConductor}
      />
    </div>
  );
};
