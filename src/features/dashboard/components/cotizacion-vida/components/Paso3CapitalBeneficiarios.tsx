import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import {
  Users,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Scale,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type {
  CotizacionVidaFormData,
  Beneficiario,
  ParentescoBeneficiario,
} from '../types/cotizacion-vida.types';

export interface Paso3CapitalBeneficiariosProps {
  register: UseFormRegister<CotizacionVidaFormData>;
  errors: FieldErrors<CotizacionVidaFormData>;
  watch: UseFormWatch<CotizacionVidaFormData>;
  setValue: UseFormSetValue<CotizacionVidaFormData>;
  fields: Beneficiario[];
  onAgregarBeneficiario: () => void;
  onEliminarBeneficiario: (index: number) => void;
  sumaPorcentajes: number;
  esPorcentajeExacto: boolean;
  stepError?: string | null;
}

const PARENTESCOS: { value: ParentescoBeneficiario; label: string }[] = [
  { value: 'CONYUGE', label: 'Cónyuge / Pareja de Hecho' },
  { value: 'HIJO', label: 'Hijo/a' },
  { value: 'PADRE_MADRE', label: 'Padre / Madre' },
  { value: 'HERMANO', label: 'Hermano/a' },
  { value: 'OTRO', label: 'Otro Beneficiario Legal' },
];

export const Paso3CapitalBeneficiarios: React.FC<Paso3CapitalBeneficiariosProps> = ({
  register,
  errors,
  watch,
  setValue,
  fields,
  onAgregarBeneficiario,
  onEliminarBeneficiario,
  sumaPorcentajes,
  esPorcentajeExacto,
  stepError,
}) => {
  const capital = watch('capitalAsegurado') || 25_000_000;
  const beneficiarios = watch('beneficiarios') || [];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('capitalAsegurado', Number(e.target.value), { shouldValidate: true });
  };

  const formatearMonto = (monto: number) =>
    `$${monto.toLocaleString('es-AR')}`;

  // Distribución automática equitativa
  const handleEquidistribuir = () => {
    if (fields.length === 0) return;
    const cuota = Math.floor(100 / fields.length);
    const resto = 100 - cuota * fields.length;
    fields.forEach((_, idx) => {
      const asignado = idx === 0 ? cuota + resto : cuota;
      setValue(`beneficiarios.${idx}.porcentaje`, asignado, { shouldValidate: true });
    });
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* 1. SECCIÓN: CAPITAL ASEGURADO */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#006e2f] flex items-center justify-center border border-emerald-200/60 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-title text-base font-bold text-[#0b1c30]">
                Capital Principal Asegurado
              </h3>
              <p className="font-body text-xs text-gray-500">
                Monto indemnizatorio total ante contingencias de vida o invalidez
              </p>
            </div>
          </div>

          <div className="text-right sm:self-center">
            <span className="font-title text-2xl sm:text-3xl font-extrabold text-[#006e2f] tracking-tight">
              {formatearMonto(capital)}
            </span>
            <span className="text-xs font-semibold text-gray-400 block sm:inline sm:ml-1">ARS</span>
          </div>
        </div>

        {/* Slider interactivo */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min={10_000_000}
            max={100_000_000}
            step={2_500_000}
            value={capital}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#006e2f]"
          />
          <div className="flex justify-between text-[11px] font-semibold text-gray-400">
            <span>$10M (Mínimo)</span>
            <span>$50M</span>
            <span>$100M (Máximo Oficial)</span>
          </div>
        </div>

        {/* Acceso directo a montos sugeridos */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[15_000_000, 25_000_000, 50_000_000, 75_000_000, 100_000_000].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setValue('capitalAsegurado', m, { shouldValidate: true })}
              className={`py-1 px-3 text-xs rounded-xl border transition-all cursor-pointer ${
                capital === m
                  ? 'bg-[#006e2f] text-white border-[#006e2f] font-bold shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              ${m / 1_000_000}M
            </button>
          ))}
        </div>
      </div>

      {/* 2. SECCIÓN: FORM-ARRAY DE BENEFICIARIOS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#006e2f]" />
            <h3 className="font-title text-base font-bold text-[#0b1c30]">
              Designación Legal de Beneficiarios
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {fields.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEquidistribuir}
                leftIcon={<Scale className="w-3.5 h-3.5" />}
                className="!py-1.5 !px-3 !text-xs !rounded-xl"
              >
                Distribuir 100% Equitativo
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onAgregarBeneficiario}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="!py-1.5 !px-3 !text-xs !rounded-xl"
            >
              Agregar Beneficiario
            </Button>
          </div>
        </div>

        {/* Medidor visual de Porcentajes */}
        <div
          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
            esPorcentajeExacto
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
              : sumaPorcentajes > 100
              ? 'bg-red-50/80 border-red-300 text-red-900'
              : 'bg-amber-50/80 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {esPorcentajeExacto ? (
              <CheckCircle2 className="w-5 h-5 text-[#006e2f] shrink-0" />
            ) : (
              <AlertCircle
                className={`w-5 h-5 shrink-0 ${
                  sumaPorcentajes > 100 ? 'text-red-600' : 'text-amber-600'
                }`}
              />
            )}
            <div className="text-xs">
              <span className="font-bold">
                {esPorcentajeExacto
                  ? 'Porcentajes verificados correctamente (Total: 100%)'
                  : sumaPorcentajes > 100
                  ? `Excedente detectado: El total suma ${sumaPorcentajes}% (Excede por ${
                      sumaPorcentajes - 100
                    }%)`
                  : `Faltan asignar porcentajes: Total actual ${sumaPorcentajes}% (Falta ${
                      100 - sumaPorcentajes
                    }%)`}
              </span>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Regla obligatoria de suscripción: El total asignado debe sumar exactamente 100% para avanzar.
              </p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className={`text-xs px-3 py-1 font-bold shrink-0 ${
              esPorcentajeExacto
                ? 'bg-emerald-100 text-[#006e2f] border-emerald-300'
                : sumaPorcentajes > 100
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {sumaPorcentajes}% / 100%
          </Badge>
        </div>

        {stepError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* Lista de beneficiarios */}
        <div className="space-y-3">
          {fields.map((field, idx) => {
            const pct = Number(beneficiarios[idx]?.porcentaje) || 0;
            const montoEstimado = Math.round((capital * pct) / 100);

            return (
              <div
                key={field.id}
                className="p-4 rounded-2xl bg-white/95 border border-gray-200/90 shadow-xs space-y-3 hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#006e2f] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-title text-sm font-bold text-[#0b1c30]">
                      Beneficiario #{idx + 1}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                      Indemnización: <strong>{formatearMonto(montoEstimado)}</strong>
                    </span>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onEliminarBeneficiario(idx)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Quitar beneficiario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <Input
                      label="Nombre y Apellido"
                      placeholder="Ej: Laura Rossi"
                      required
                      {...register(`beneficiarios.${idx}.nombreCompleto`)}
                      error={errors.beneficiarios?.[idx]?.nombreCompleto?.message}
                    />
                  </div>

                  <div>
                    <Input
                      label="DNI / Documento"
                      placeholder="Ej: 34567890"
                      maxLength={8}
                      required
                      {...register(`beneficiarios.${idx}.dni`)}
                      error={errors.beneficiarios?.[idx]?.dni?.message}
                    />
                  </div>

                  <div>
                    <Input
                      label="Porcentaje (%)"
                      type="number"
                      min={1}
                      max={100}
                      required
                      {...register(`beneficiarios.${idx}.porcentaje`, { valueAsNumber: true })}
                      error={errors.beneficiarios?.[idx]?.porcentaje?.message}
                      rightIcon={<span className="text-xs font-bold text-gray-500">%</span>}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-subtitle font-semibold text-xs text-[#0b1c30] block mb-1">
                      Parentesco o Vínculo Legal
                    </label>
                    <select
                      {...register(`beneficiarios.${idx}.parentesco`)}
                      className="w-full text-xs font-body p-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15 outline-none"
                    >
                      {PARENTESCOS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center text-[11px] text-gray-500 italic sm:self-end sm:pb-2">
                    Designación formal protegida por la Ley de Seguros 17.418.
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
