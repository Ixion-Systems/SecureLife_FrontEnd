import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { User, Calendar, Briefcase, ShieldAlert, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type {
  CotizacionVidaFormData,
  CategoriaRiesgoLaboral,
  GeneroAsegurado,
} from '../types/cotizacion-vida.types';

export interface Paso1DatosAseguradoProps {
  register: UseFormRegister<CotizacionVidaFormData>;
  errors: FieldErrors<CotizacionVidaFormData>;
  watch: UseFormWatch<CotizacionVidaFormData>;
  setValue: UseFormSetValue<CotizacionVidaFormData>;
}

interface CategoriaConfig {
  id: CategoriaRiesgoLaboral;
  title: string;
  factor: string;
  badgeClassName: string;
  ejemplos: string;
}

const CATEGORIAS_RIESGO: CategoriaConfig[] = [
  {
    id: 'ADMINISTRATIVO',
    title: 'Administrativo / Profesional',
    factor: 'Riesgo Base (1.0x)',
    badgeClassName: 'bg-emerald-50 text-[#006e2f] border-emerald-200',
    ejemplos: 'Oficina, docencia, IT, contabilidad, gestión remota.',
  },
  {
    id: 'COMERCIAL',
    title: 'Comercial y Ventas',
    factor: 'Riesgo Moderado (1.15x)',
    badgeClassName: 'bg-blue-50 text-blue-700 border-blue-200',
    ejemplos: 'Atención al público, preventistas, viajes frecuentes en ruta.',
  },
  {
    id: 'INDUSTRIAL',
    title: 'Industrial y Operativo',
    factor: 'Riesgo Intermedio (1.35x)',
    badgeClassName: 'bg-amber-50 text-amber-700 border-amber-200',
    ejemplos: 'Manufactura, talleres, logística de carga, maquinaria.',
  },
  {
    id: 'ALTO_RIESGO',
    title: 'Alto Riesgo y Fuerzas',
    factor: 'Riesgo Agravado (1.70x)',
    badgeClassName: 'bg-rose-50 text-rose-700 border-rose-200',
    ejemplos: 'Seguridad armada, trabajo en altura, minería, hidrocarburos.',
  },
];

export const Paso1DatosAsegurado: React.FC<Paso1DatosAseguradoProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const watchedFechaNac = watch('fechaNacimiento');
  const watchedGenero = watch('genero');
  const watchedCategoria = watch('categoriaRiesgo');

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('fechaNacimiento', val, { shouldValidate: true });
    if (val) {
      const fecha = new Date(val);
      if (!isNaN(fecha.getTime())) {
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const m = hoy.getMonth() - fecha.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
          edad--;
        }
        if (edad >= 0 && edad <= 120) {
          setValue('edad', edad, { shouldValidate: true });
        }
      }
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner explicativo */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-[#006e2f]/10 text-[#006e2f] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-title text-sm font-bold text-[#0b1c30]">
            Paso 1: Datos Personales y Clasificación Ocupacional
          </h3>
          <p className="font-body text-xs text-gray-600 mt-0.5 leading-relaxed">
            La edad actuarial y el tipo de actividad laboral determinan la tasa base de mortalidad y el
            coeficiente de riesgo aprobado por la Superintendencia de Seguros de la Nación.
          </p>
        </div>
      </div>

      {/* Bloque: Fecha Nacimiento, Edad y Género */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Input
            label="Fecha de Nacimiento"
            type="date"
            required
            value={watchedFechaNac || ''}
            onChange={handleFechaChange}
            error={errors.fechaNacimiento?.message}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        </div>

        <div>
          <Input
            label="Edad Actuarial (Años)"
            type="number"
            required
            {...register('edad', { valueAsNumber: true })}
            error={errors.edad?.message}
            helperText="Rango asegurable: 18 a 75 años"
            leftIcon={<User className="w-4 h-4" />}
          />
        </div>

        <div>
          <label className="font-subtitle font-semibold text-xs md:text-sm text-[#0b1c30] block mb-1.5">
            Género Biológico <span className="text-[#22c55e] text-[11px] font-normal">* Requerido</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['MASCULINO', 'FEMENINO', 'OTRO'] as GeneroAsegurado[]).map((gen) => (
              <button
                key={gen}
                type="button"
                onClick={() => setValue('genero', gen, { shouldValidate: true })}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer truncate text-center ${
                  watchedGenero === gen
                    ? 'bg-[#006e2f] text-white border-[#006e2f] shadow-xs'
                    : 'bg-white/80 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {gen === 'MASCULINO' ? 'Masculino' : gen === 'FEMENINO' ? 'Femenino' : 'Otro'}
              </button>
            ))}
          </div>
          {errors.genero?.message && (
            <p className="text-xs text-red-500 mt-1">{errors.genero.message}</p>
          )}
        </div>
      </div>

      {/* Bloque: Ocupación Laboral */}
      <div>
        <Input
          label="Ocupación o Profesión Principal"
          placeholder="Ej: Ingeniero de Software, Contador, Docente, Técnico Electricista..."
          required
          {...register('ocupacion')}
          error={errors.ocupacion?.message}
          leftIcon={<Briefcase className="w-4 h-4" />}
          helperText="Detalla tu actividad profesional o laboral habitual"
        />
      </div>

      {/* Bloque: Categoría de Riesgo Ocupacional */}
      <div className="space-y-2">
        <label className="font-subtitle font-semibold text-xs md:text-sm text-[#0b1c30] flex items-center justify-between">
          <span>Categoría de Riesgo Ocupacional</span>
          <span className="text-gray-400 font-normal text-xs flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Factor tarifario
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIAS_RIESGO.map((cat) => {
            const isSelected = watchedCategoria === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setValue('categoriaRiesgo', cat.id, { shouldValidate: true })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  isSelected
                    ? 'bg-emerald-50/50 border-[#006e2f] ring-2 ring-[#006e2f]/15 shadow-sm'
                    : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-title text-sm font-bold text-[#0b1c30]">{cat.title}</h4>
                  <Badge variant="secondary" className={`text-[10px] py-0.5 px-2 ${cat.badgeClassName}`}>
                    {cat.factor}
                  </Badge>
                </div>
                <p className="font-body text-xs text-gray-500 mt-2 leading-relaxed">
                  {cat.ejemplos}
                </p>
              </div>
            );
          })}
        </div>
        {errors.categoriaRiesgo?.message && (
          <p className="text-xs text-red-500 mt-1">{errors.categoriaRiesgo.message}</p>
        )}
      </div>
    </div>
  );
};
