import React from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Smartphone, Laptop, Camera, Bike, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { CotizacionObjetoFormData, TipoObjeto } from '../types/cotizacion-objeto.types';

export interface Paso1TipologiaBienProps {
  watch: UseFormWatch<CotizacionObjetoFormData>;
  setValue: UseFormSetValue<CotizacionObjetoFormData>;
}

interface TipoCardConfig {
  id: TipoObjeto;
  title: string;
  subtitle: string;
  desc: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  borderActive: string;
}

const TIPOS_BIEN: TipoCardConfig[] = [
  {
    id: 'SMARTPHONE',
    title: 'Smartphone / Teléfono Celular',
    subtitle: 'iOS, Android y terminales de alta gama',
    desc: 'Cobertura por arrebato en vía pública, rotura de módulo/pantalla y daño por líquidos. Validación automática de IMEI de 15 dígitos.',
    tag: 'Inspección IMEI *#06#',
    icon: Smartphone,
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    borderActive: 'border-amber-600 ring-2 ring-amber-600/20 bg-amber-50/30',
  },
  {
    id: 'NOTEBOOK',
    title: 'Laptop / Notebook / Tablet',
    subtitle: 'Equipos portátiles de trabajo y estudio',
    desc: 'Protección mundial para herramientas de trabajo ante robo con violencia, rotura accidental de teclado/display y derrame de café.',
    tag: 'Cobertura Internacional',
    icon: Laptop,
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    borderActive: 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/30',
  },
  {
    id: 'CAMARA',
    title: 'Cámara Fotográfica / Filmación',
    subtitle: 'Cuerpos réflex, mirrorless, lentes y drones',
    desc: 'Respaldo pericial para equipamiento profesional y audiovisual ante caídas, golpes y robo en locaciones de trabajo.',
    tag: 'Equipos Profesionales',
    icon: Camera,
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    borderActive: 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30',
  },
  {
    id: 'MICROMOVILIDAD',
    title: 'Bicicleta / Micromovilidad',
    subtitle: 'Bicicletas de carrera, MTB y monopatines e-motion',
    desc: 'Cobertura contra robo violento y hurto con candado homologado, daños a cuadro por caída y auxilio de traslado.',
    tag: 'Movilidad Sustentable',
    icon: Bike,
    iconBg: 'bg-emerald-50 text-[#006e2f] border-emerald-200',
    borderActive: 'border-[#006e2f] ring-2 ring-[#006e2f]/20 bg-emerald-50/30',
  },
];

export const Paso1TipologiaBien: React.FC<Paso1TipologiaBienProps> = ({ watch, setValue }) => {
  const selectedTipo = watch('tipoObjeto');

  const handleSelectTipo = (tipo: TipoObjeto) => {
    setValue('tipoObjeto', tipo, { shouldValidate: true });
    // Resetear marcas/modelos default según categoría
    if (tipo === 'SMARTPHONE') {
      setValue('marca', 'Apple');
      setValue('modelo', 'iPhone 15 Pro');
      setValue('numeroSerieOimei', '358941123456789');
      setValue('valorEstimado', 1_850_000);
    } else if (tipo === 'NOTEBOOK') {
      setValue('marca', 'Lenovo');
      setValue('modelo', 'ThinkPad T14 Gen 4');
      setValue('numeroSerieOimei', 'PF3XYZ99');
      setValue('valorEstimado', 2_400_000);
    } else if (tipo === 'CAMARA') {
      setValue('marca', 'Sony');
      setValue('modelo', 'Alpha A7 IV + Lente 24-70mm');
      setValue('numeroSerieOimei', 'SN-8849201');
      setValue('valorEstimado', 3_600_000);
    } else {
      setValue('marca', 'Trek');
      setValue('modelo', 'Marlin 7 Gen 3');
      setValue('numeroSerieOimei', 'WTU291048201');
      setValue('valorEstimado', 1_100_000);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner explicativo */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-title text-sm font-bold text-[#0b1c30]">
            Paso 1: Selección de Tipología de Tecnología y Objetos
          </h3>
          <p className="font-body text-xs text-gray-600 mt-0.5 leading-relaxed">
            Cada clase de dispositivo cuenta con algoritmos de valuación de reposición propios y
            requisitos periciales específicos (ej: validación de IMEI para teléfonos inteligentes).
          </p>
        </div>
      </div>

      {/* Grid de 4 tarjetas interactivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIPOS_BIEN.map((item) => {
          const isSelected = selectedTipo === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => handleSelectTipo(item.id)}
              className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left ${
                isSelected
                  ? `${item.borderActive} shadow-md`
                  : 'bg-white border-gray-200/90 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.iconBg} shadow-xs transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] py-0.5 px-2 font-medium">
                    {item.tag}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-title text-base font-bold text-[#0b1c30] group-hover:text-[#006e2f] transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#006e2f] translate-x-1' : 'text-gray-400'
                      }`}
                    />
                  </h4>
                  <p className="font-subtitle text-[11px] font-semibold text-gray-500 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <p className="font-body text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                <span className={isSelected ? 'text-[#006e2f]' : 'text-gray-500'}>
                  {isSelected ? '✓ Seleccionado para cotizar' : 'Click para elegir'}
                </span>
                <span className="text-gray-400 text-xs">Paso 2 →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
