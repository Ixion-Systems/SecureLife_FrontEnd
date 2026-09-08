import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { HeartPulse, Cigarette, Flame, Activity, Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import type { CotizacionVidaFormData } from '../types/cotizacion-vida.types';

export interface Paso2SaludHabitosProps {
  register: UseFormRegister<CotizacionVidaFormData>;
  errors: FieldErrors<CotizacionVidaFormData>;
  watch: UseFormWatch<CotizacionVidaFormData>;
  setValue: UseFormSetValue<CotizacionVidaFormData>;
}

const DEPORTES_LISTA = [
  'Alpinismo / Escalada en roca',
  'Paracaidismo / Salto Bungee',
  'Buceo autónomo profundo (>18m)',
  'Automovilismo / Motociclismo de pista',
  'Parapente / Ala delta',
  'Artes marciales de contacto pleno',
];

const ENFERMEDADES_LISTA = [
  'Hipertensión arterial diagnosticada',
  'Diabetes Mellitus (Tipo 1 o 2)',
  'Afecciones cardiovasculares o arritmias',
  'Asma crónica o patologías pulmonares',
  'Trastornos oncológicos previos',
  'Enfermedad renal o hepática crónica',
];

export const Paso2SaludHabitos: React.FC<Paso2SaludHabitosProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const esFumador = watch('esFumador');
  const practicaDeportes = watch('practicaDeportesRiesgo');
  const deportesDeclarados = watch('deportesDeclarados') || [];
  const tienePreexistencias = watch('tieneEnfermedadesPreexistentes');
  const enfermedadesDeclaradas = watch('enfermedadesDeclaradas') || [];

  const toggleDeporte = (deporte: string) => {
    const exists = deportesDeclarados.includes(deporte);
    const nuevo = exists
      ? deportesDeclarados.filter((d) => d !== deporte)
      : [...deportesDeclarados, deporte];
    setValue('deportesDeclarados', nuevo);
  };

  const toggleEnfermedad = (enf: string) => {
    const exists = enfermedadesDeclaradas.includes(enf);
    const nuevo = exists
      ? enfermedadesDeclaradas.filter((e) => e !== enf)
      : [...enfermedadesDeclaradas, enf];
    setValue('enfermedadesDeclaradas', nuevo);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner de Declaración Jurada Médica */}
      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
          <HeartPulse className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-title text-sm font-bold text-[#0b1c30]">
            Paso 2: Declaración Jurada de Salud y Hábitos
          </h3>
          <p className="font-body text-xs text-gray-600 mt-0.5 leading-relaxed">
            La veracidad de las declaraciones sobre tabaquismo, antecedentes clínicos y actividades deportivas
            asegura la plena validez de la cobertura y la celeridad ante cualquier liquidación.
          </p>
        </div>
      </div>

      {/* 1. Tabaquismo */}
      <div className="p-4 rounded-2xl bg-white/90 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cigarette className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-title text-sm font-bold text-[#0b1c30]">¿Consumo Habitual de Tabaco?</h4>
              <p className="font-body text-xs text-gray-500">
                ¿Has fumado cigarrillos, puros o vapeadores con nicotina en los últimos 12 meses?
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={esFumador}
              onChange={(e) => {
                setValue('esFumador', e.target.checked);
                if (!e.target.checked) setValue('cigarrillosPorDia', 0);
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006e2f]" />
          </label>
        </div>

        {esFumador && (
          <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-down">
            <Input
              label="Cigarrillos promedio por día"
              type="number"
              min={1}
              max={100}
              placeholder="Ej: 10"
              {...register('cigarrillosPorDia', { valueAsNumber: true })}
              error={errors.cigarrillosPorDia?.message}
            />
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-2 text-xs text-amber-800 self-center">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Aplica recargo actuarial técnico de fumador (+35%).</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Deportes de Alto Riesgo */}
      <div className="p-4 rounded-2xl bg-white/90 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-title text-sm font-bold text-[#0b1c30]">
                ¿Práctica de Deportes Extremos o de Alto Riesgo?
              </h4>
              <p className="font-body text-xs text-gray-500">
                Actividades aéreas, subacuáticas, montaña o velocidad motorizada.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={practicaDeportes}
              onChange={(e) => {
                setValue('practicaDeportesRiesgo', e.target.checked);
                if (!e.target.checked) setValue('deportesDeclarados', []);
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006e2f]" />
          </label>
        </div>

        {practicaDeportes && (
          <div className="pt-3 border-t border-gray-100 space-y-2 animate-slide-down">
            <p className="text-xs font-semibold text-gray-700">Selecciona las disciplinas que practicas:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEPORTES_LISTA.map((deporte) => {
                const isChecked = deportesDeclarados.includes(deporte);
                return (
                  <button
                    key={deporte}
                    type="button"
                    onClick={() => toggleDeporte(deporte)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-blue-50/70 border-blue-500 text-blue-900 shadow-xs'
                        : 'bg-gray-50/70 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{deporte}</span>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-blue-600 text-white' : 'border border-gray-300'
                      }`}
                    >
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Enfermedades Preexistentes */}
      <div className="p-4 rounded-2xl bg-white/90 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-title text-sm font-bold text-[#0b1c30]">
                ¿Enfermedades Preexistentes o Diagnósticos Crónicos?
              </h4>
              <p className="font-body text-xs text-gray-500">
                ¿Posees o has recibido tratamiento médico por patologías crónicas?
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={tienePreexistencias}
              onChange={(e) => {
                setValue('tieneEnfermedadesPreexistentes', e.target.checked);
                if (!e.target.checked) {
                  setValue('enfermedadesDeclaradas', []);
                  setValue('observacionesSalud', '');
                }
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006e2f]" />
          </label>
        </div>

        {tienePreexistencias && (
          <div className="pt-3 border-t border-gray-100 space-y-3 animate-slide-down">
            <p className="text-xs font-semibold text-gray-700">Indica los diagnósticos relevantes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ENFERMEDADES_LISTA.map((enf) => {
                const isChecked = enfermedadesDeclaradas.includes(enf);
                return (
                  <button
                    key={enf}
                    type="button"
                    onClick={() => toggleEnfermedad(enf)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-rose-50/70 border-rose-500 text-rose-900 shadow-xs'
                        : 'bg-gray-50/70 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{enf}</span>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-rose-600 text-white' : 'border border-gray-300'
                      }`}
                    >
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2">
              <label className="font-subtitle font-semibold text-xs text-[#0b1c30] block mb-1">
                Detalle u observaciones adicionales (medicación actual o cirugías):
              </label>
              <textarea
                rows={2}
                {...register('observacionesSalud')}
                placeholder="Indica medicación habitual, fecha aproximada del diagnóstico o controles periódicos..."
                className="w-full text-xs font-body p-3 rounded-xl border border-gray-200 bg-white focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15 outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
