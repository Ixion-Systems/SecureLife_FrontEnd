import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import {
  Tag,
  Cpu,
  Hash,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import type { CotizacionObjetoFormData } from '../types/cotizacion-objeto.types';

export interface Paso2IdentificacionValuacionProps {
  register: UseFormRegister<CotizacionObjetoFormData>;
  errors: FieldErrors<CotizacionObjetoFormData>;
  watch: UseFormWatch<CotizacionObjetoFormData>;
  setValue: UseFormSetValue<CotizacionObjetoFormData>;
  stepError?: string | null;
}

export const Paso2IdentificacionValuacion: React.FC<Paso2IdentificacionValuacionProps> = ({
  register,
  errors,
  watch,
  setValue,
  stepError,
}) => {
  const tipoObjeto = watch('tipoObjeto');
  const numeroSerie = watch('numeroSerieOimei') || '';
  const valorEstimado = watch('valorEstimado') || 1_200_000;

  const isSmartphone = tipoObjeto === 'SMARTPHONE';
  const imeiDigitsOnly = numeroSerie.replace(/\D/g, '');
  const isImeiValido = isSmartphone ? imeiDigitsOnly.length === 15 : numeroSerie.trim().length >= 4;

  const formatearMonto = (m: number) => `$${m.toLocaleString('es-AR')}`;

  const handleImeiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (isSmartphone) {
      val = val.replace(/\D/g, '').slice(0, 15);
    }
    setValue('numeroSerieOimei', val, { shouldValidate: true });
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner de Valuación */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <Tag className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-title text-sm font-bold text-[#0b1c30]">
            Paso 2: Identificación Técnica y Valuación del Dispositivo
          </h3>
          <p className="font-body text-xs text-gray-600 mt-0.5 leading-relaxed">
            Ingresa los datos unívocos del equipo para cotejo de autenticidad pericial y el valor de
            reposición en el mercado actual.
          </p>
        </div>
      </div>

      {stepError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* Marca y Modelo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="Marca del Fabricante"
            placeholder={
              isSmartphone ? 'Ej: Apple, Samsung, Xiaomi' : 'Ej: Lenovo, Dell, Sony, Trek'
            }
            required
            {...register('marca')}
            error={errors.marca?.message}
            leftIcon={<Cpu className="w-4 h-4" />}
          />
        </div>

        <div>
          <Input
            label="Modelo y Capacidad / Versión"
            placeholder={
              isSmartphone ? 'Ej: iPhone 15 Pro 256GB' : 'Ej: ThinkPad T14 / Alpha A7 IV'
            }
            required
            {...register('modelo')}
            error={errors.modelo?.message}
            leftIcon={<Tag className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Número de Serie o IMEI con Validador Estricto */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="font-subtitle font-semibold text-xs md:text-sm text-[#0b1c30] flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-[#006e2f]" />
            <span>
              {isSmartphone ? 'Código IMEI Internacional (15 Dígitos)' : 'Número de Serie de Fábrica'}
            </span>
            <span className="text-[#22c55e] text-[11px] font-normal">* Requerido</span>
          </label>

          {isSmartphone && (
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
                  isImeiValido
                    ? 'bg-emerald-50 text-[#006e2f] border-emerald-300'
                    : 'bg-amber-50 text-amber-700 border-amber-300'
                }`}
              >
                {imeiDigitsOnly.length} / 15 dígitos
              </span>
            </div>
          )}
        </div>

        <Input
          placeholder={
            isSmartphone
              ? 'Marca *#06# en el marcador de tu teléfono (15 dígitos)'
              : 'Ej: SN-49201948201'
          }
          value={numeroSerie}
          onChange={handleImeiChange}
          error={errors.numeroSerieOimei?.message}
          maxLength={isSmartphone ? 15 : 30}
          leftIcon={<Hash className="w-4 h-4" />}
          rightIcon={
            isImeiValido ? (
              <CheckCircle2 className="w-4 h-4 text-[#006e2f]" />
            ) : isSmartphone ? (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            ) : undefined
          }
        />

        {isSmartphone ? (
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-start gap-2.5 text-xs text-blue-900">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>¿Cómo obtener tu IMEI?</strong> Abre la aplicación de llamadas de tu teléfono y
              marca <strong>*#06#</strong>. Aparecerá en pantalla el código IMEI único que valida la
              legitimidad de tu terminal ante el Ente Nacional de Comunicaciones (ENACOM).
            </span>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Encuentra el número grabado en el chasis, cuadro o etiqueta de homologación del fabricante.
          </p>
        )}
      </div>

      {/* Valuación Estimada y Año de Compra */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Valor de Reposición Estimado ($ ARS)"
            type="number"
            min={100_000}
            max={15_000_000}
            step={50_000}
            required
            {...register('valorEstimado', { valueAsNumber: true })}
            error={errors.valorEstimado?.message}
            leftIcon={<DollarSign className="w-4 h-4" />}
            helperText={`Valor declarado: ${formatearMonto(valorEstimado)} ARS (Rango: $100K a $15M)`}
          />
        </div>

        <div>
          <Input
            label="Año de Compra"
            type="number"
            min={2018}
            max={new Date().getFullYear()}
            required
            {...register('anioCompra', { valueAsNumber: true })}
            error={errors.anioCompra?.message}
            leftIcon={<Calendar className="w-4 h-4" />}
            helperText="Antigüedad máx: 2018"
          />
        </div>
      </div>
    </div>
  );
};
