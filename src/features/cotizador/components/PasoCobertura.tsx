import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Trash2,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import type {
  CotizacionAutoFormData,
  CoberturaTipo,
} from '../types/cotizacion-auto.types';

export interface PasoCoberturaProps {
  register: UseFormRegister<CotizacionAutoFormData>;
  errors: FieldErrors<CotizacionAutoFormData>;
  watch: UseFormWatch<CotizacionAutoFormData>;
  setValue: UseFormSetValue<CotizacionAutoFormData>;
  conductoresFields: Array<{ id: string }>;
  addConductor: () => void;
  removeConductor: (index: number) => void;
}

interface CoberturaOption {
  tipo: CoberturaTipo;
  title: string;
  badge: string;
  isPopular?: boolean;
  icon: React.ReactNode;
  description: string;
  features: string[];
}

const COVERAGE_OPTIONS: CoberturaOption[] = [
  {
    tipo: 'RESPONSABILIDAD_CIVIL',
    title: 'Responsabilidad Civil',
    badge: 'Básica Legal',
    icon: <Shield className="w-5 h-5" />,
    description: 'Cumple con la exigencia de la Ley Nacional de Tránsito ante reclamos de terceros transportados y no transportados.',
    features: [
      'Límite legal obligatorio de RC',
      'Asistencia legal 24/7 en siniestros',
      'Auxilio mecánico básico (hasta 100 km)',
    ],
  },
  {
    tipo: 'TERCEROS_COMPLETO',
    title: 'Terceros Completo',
    badge: 'Más Elegida',
    isPopular: true,
    icon: <ShieldCheck className="w-5 h-5" />,
    description: 'La protección integral más recomendada. Respaldo total ante robo, hurto, incendio y daños por factores climáticos.',
    features: [
      'Robo o hurto total y parcial sin franquicia',
      'Incendio total y parcial',
      'Cobertura de daños por granizo e inundación',
      'Reposición de cerraduras y cristales laterales',
      'Auxilio y remolque hasta 300 km',
    ],
  },
  {
    tipo: 'TODO_RIESGO_CON_FRANQUICIA',
    title: 'Todo Riesgo con Franquicia',
    badge: 'Máxima Protección',
    icon: <ShieldAlert className="w-5 h-5" />,
    description: 'Cero preocupaciones. Cubre daños parciales y totales por accidente propio, vandalismo y siniestros con terceros.',
    features: [
      'Daños parciales por accidente con franquicia fija reducida',
      'Reposición de parabrisas y luneta sin límite de eventos',
      'Robo de neumáticos a valor de reposición a nuevo',
      'Vehículo de sustitución hasta 7 días',
      'Remolque sin límite de kilometraje nacional',
    ],
  },
];

/**
 * PasoCobertura Component
 * 
 * Step 3 of the Auto Insurance Quoting Wizard.
 * Visual interactive coverage selection cards with glassmorphism,
 * plus optional additional designated drivers list with dynamic management.
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
      {/* Header Info */}
      <div className="text-left">
        <h3 className="font-title text-xl md:text-2xl font-bold text-[#0b1c30]">
          Elige el Nivel de Cobertura
        </h3>
        <p className="font-subtitle text-sm text-gray-600 mt-1">
          Selecciona el plan que mejor se adapte a tus hábitos de conducción y necesidades de protección.
        </p>
      </div>

      {/* Coverage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COVERAGE_OPTIONS.map((opt) => {
          const isSelected = selectedCobertura === opt.tipo;

          return (
            <div
              key={opt.tipo}
              onClick={() => setValue('coberturaSolicitada', opt.tipo, { shouldValidate: true })}
              className={`relative cursor-pointer rounded-2xl p-5 md:p-6 transition-all duration-300 text-left flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-white/95 border-2 border-[#22c55e] shadow-xl shadow-[#22c55e]/15 scale-[1.02]'
                  : 'glass-card hover:bg-white/90 border border-white/80 hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {/* Popular Badge Top Floating */}
              {opt.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge
                    variant="primary"
                    className="shadow-sm font-subtitle text-[11px] uppercase tracking-wider font-bold bg-[#22c55e] text-[#004b1e] border-0"
                  >
                    ⭐ {opt.badge}
                  </Badge>
                </div>
              )}

              <div>
                {/* Header Icon + Selection Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#22c55e] text-white shadow-sm'
                        : 'bg-emerald-50 text-[#006e2f]'
                    }`}
                  >
                    {opt.icon}
                  </div>

                  <div className="flex items-center">
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-[#22c55e]" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                </div>

                {/* Card Title & Badge */}
                <h4 className="font-title text-base md:text-lg font-bold text-[#0b1c30]">
                  {opt.title}
                </h4>
                {!opt.isPopular && (
                  <Badge variant="secondary" className="mt-1 text-[10px] py-0.5 px-2">
                    {opt.badge}
                  </Badge>
                )}

                <p className="font-body text-xs text-gray-600 mt-3 leading-relaxed">
                  {opt.description}
                </p>

                {/* Feature Bullet Points */}
                <ul className="mt-4 space-y-2">
                  {opt.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-body text-gray-700">
                      <span className="text-[#22c55e] font-bold text-sm leading-none shrink-0 mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100">
                <span
                  className={`text-xs font-subtitle font-semibold block text-center ${
                    isSelected ? 'text-[#006e2f]' : 'text-gray-500'
                  }`}
                >
                  {isSelected ? 'Cobertura Seleccionada' : 'Seleccionar este plan'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Drivers Section */}
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

        {/* List of Additional Drivers */}
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
                  className="p-4 rounded-xl bg-white/90 border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-end gap-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-grow w-full">
                    <Input
                      label="Nombre y Apellido"
                      placeholder="Ej: Laura Pérez"
                      required
                      error={driverErrors?.nombreCompleto?.message}
                      {...register(`conductoresAdicionales.${index}.nombreCompleto`)}
                    />

                    <Input
                      label="Parentesco"
                      placeholder="Ej: Cónyuge, Hijo/a"
                      required
                      error={driverErrors?.parentesco?.message}
                      {...register(`conductoresAdicionales.${index}.parentesco`)}
                    />

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

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeConductor(index)}
                    aria-label={`Eliminar conductor ${index + 1}`}
                    className="p-2.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 shrink-0 self-end md:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
