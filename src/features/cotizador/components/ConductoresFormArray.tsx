import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { CotizacionAutoFormData } from '../types/cotizacion-auto.types';
import { PARENTESCO_OPTIONS } from '../data/coberturaData';

export interface ConductoresFormArrayProps {
  register: UseFormRegister<CotizacionAutoFormData>;
  errors: FieldErrors<CotizacionAutoFormData>;
  watch: UseFormWatch<CotizacionAutoFormData>;
  setValue: UseFormSetValue<CotizacionAutoFormData>;
  conductoresFields: Array<{ id: string }>;
  addConductor: () => void;
  removeConductor: (index: number) => void;
}

/**
 * ConductoresFormArray Component
 * 
 * Dynamic list manager for additional designated drivers on the insurance policy.
 * Provides add/remove actions, relationship selects, and age inputs.
 *
 * @component
 * @layer Presentation / Feature Subcomponent
 * @module features/cotizador/components/ConductoresFormArray
 * 
 * @param {ConductoresFormArrayProps} props - Component properties.
 * @returns {React.ReactElement} Designated drivers card section.
 */
export const ConductoresFormArray: React.FC<ConductoresFormArrayProps> = ({
  register,
  errors,
  watch,
  setValue,
  conductoresFields,
  addConductor,
  removeConductor,
}) => {
  return (
    <Card variant="glass-surface" className="p-5 md:p-6 text-left rounded-2xl border-white/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#22c55e]/15 text-[#006e2f]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-title text-base font-bold text-[#0b1c30]">
              Conductores Adicionales
            </h4>
            <p className="font-body text-xs text-gray-600">
              ¿Otras personas conducen habitualmente este automóvil?
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="glass"
          size="sm"
          onClick={addConductor}
          leftIcon={<UserPlus className="w-4 h-4 text-[#006e2f]" />}
          className="text-xs shrink-0 self-start sm:self-auto bg-white/90 hover:bg-white"
        >
          Agregar Conductor
        </Button>
      </div>

      {conductoresFields.length === 0 ? (
        <div className="p-4 rounded-xl bg-gray-50/60 border border-dashed border-gray-200 text-center">
          <p className="text-xs text-gray-500 font-body">
            No has agregado conductores adicionales. La póliza cubrirá al titular y a conductores con permiso legal.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conductoresFields.map((item, index) => {
            const driverErrors = errors.conductoresAdicionales?.[index];

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-gray-200/80 shadow-sm flex flex-col gap-3.5 transition-all animate-popover"
              >
                {/* Driver Card Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#22c55e]/20 text-[#006e2f] text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-subtitle text-xs font-bold text-[#0b1c30]">
                      Conductor Designado #{index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeConductor(index)}
                    aria-label={`Eliminar conductor ${index + 1}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-subtitle text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Eliminar</span>
                  </button>
                </div>

                {/* Responsive Grid of Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 w-full">
                  <div className="sm:col-span-1 lg:col-span-5">
                    <Input
                      label="Nombre y Apellido"
                      placeholder="Ej: Laura Pérez"
                      required
                      error={driverErrors?.nombreCompleto?.message}
                      {...register(`conductoresAdicionales.${index}.nombreCompleto`)}
                    />
                  </div>

                  <div className="sm:col-span-1 lg:col-span-4">
                    <Select
                      label="Parentesco"
                      placeholder="Seleccioná parentesco..."
                      required
                      value={watch(`conductoresAdicionales.${index}.parentesco`) || ''}
                      onChange={(val) =>
                        setValue(`conductoresAdicionales.${index}.parentesco`, val, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      options={PARENTESCO_OPTIONS}
                      error={driverErrors?.parentesco?.message}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <Input
                      label="Edad"
                      type="number"
                      min={17}
                      max={99}
                      placeholder="Ej: 28"
                      required
                      error={driverErrors?.edad?.message}
                      {...register(`conductoresAdicionales.${index}.edad`, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
