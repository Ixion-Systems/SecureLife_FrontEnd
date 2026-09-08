import React, { useEffect, useCallback } from 'react';
import { X, Car, Home, HeartPulse, Smartphone, ArrowRight, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export type AssetType = 'AUTOMOTOR' | 'HOGAR_INMUEBLE' | 'VIDA' | 'OBJETO_PERSONAL';

export interface SelectAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (type: AssetType) => void;
}

interface AssetOption {
  id: AssetType;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  borderHover: string;
  glowHover: string;
}

const ASSET_OPTIONS: AssetOption[] = [
  {
    id: 'AUTOMOTOR',
    title: 'Vehículo Automotor',
    subtitle: 'Autos, camionetas, SUVs y utilitarios',
    description:
      'Coberturas contra Terceros, Todo Riesgo con franquicia, granizo ilimitado y auxilio mecánico con grúa satelital 24/7 en todo el país.',
    tag: 'Tasación Oficial ACARA',
    icon: Car,
    iconBg: 'bg-emerald-50 text-[#006e2f] border-emerald-200/80',
    iconColor: 'text-[#006e2f]',
    borderHover: 'hover:border-[#006e2f]',
    glowHover: 'group-hover:shadow-emerald-900/10',
  },
  {
    id: 'HOGAR_INMUEBLE',
    title: 'Hogar e Inmuebles',
    subtitle: 'Casas particulares, departamentos y PH',
    description:
      'Protección integral ante incendio de edificio y contenido, robo, daños por agua, cristales y servicio de urgencias domiciliarias 24h.',
    tag: 'Inspección 100% Digital',
    icon: Home,
    iconBg: 'bg-blue-50 text-[#0b1c30] border-blue-200/80',
    iconColor: 'text-[#0b1c30]',
    borderHover: 'hover:border-[#0b1c30]',
    glowHover: 'group-hover:shadow-blue-900/10',
  },
  {
    id: 'VIDA',
    title: 'Vida y Salud',
    subtitle: 'Protección personal, familiar y accidentes',
    description:
      'Respaldo económico ante fallecimiento, invalidez permanente o enfermedades críticas con libre designación de beneficiarios y cláusulas claras.',
    tag: 'Libre Designación',
    icon: HeartPulse,
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200/80',
    iconColor: 'text-rose-600',
    borderHover: 'hover:border-rose-500',
    glowHover: 'group-hover:shadow-rose-900/10',
  },
  {
    id: 'OBJETO_PERSONAL',
    title: 'Tecnología y Objetos',
    subtitle: 'Smartphones, notebooks, cámaras y bicicletas',
    description:
      'Cobertura mundial frente a robo violento, rotura accidental de pantalla y daño eléctrico para tus herramientas de trabajo y equipos diarios.',
    tag: 'Cobertura en el Exterior',
    icon: Smartphone,
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconColor: 'text-amber-700',
    borderHover: 'hover:border-amber-500',
    glowHover: 'group-hover:shadow-amber-900/10',
  },
];

/**
 * SelectAssetModal Component
 *
 * Floating modal presented to authenticated users when clicking to contract/quote
 * a new policy. Displays the 4 official insurance branches (Vehículo, Inmueble, Vida, Objeto)
 * before taking the user to their dedicated underwriting form.
 *
 * @component
 * @layer Presentation / Feature Component
 * @module features/dashboard/components/SelectAssetModal
 */
export const SelectAssetModal: React.FC<SelectAssetModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
}) => {
  // ESC key listener & body scroll-lock
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-asset-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-scale-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl flex flex-col bg-[#f8f9ff]/98 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl shadow-[#0b1c30]/25 z-10 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-white/80 border-b border-gray-200/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006e2f]/10 text-[#006e2f] flex items-center justify-center border border-[#006e2f]/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="select-asset-title"
                className="font-title text-lg sm:text-xl font-bold text-[#0b1c30] leading-tight"
              >
                Contratar Nueva Póliza
              </h2>
              <p className="font-body text-xs text-gray-500">
                Selecciona el tipo de patrimonio o sujeto que deseas proteger
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: 4 Asset Options Grid */}
        <div className="p-5 sm:p-6 md:p-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ASSET_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectAsset(opt.id)}
                  className={`group relative p-5 rounded-2xl bg-white border border-gray-200/80 ${opt.borderHover} shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between text-left hover:-translate-y-0.5`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border ${opt.iconBg} shadow-xs transition-transform duration-200 group-hover:scale-105`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="glass" className="text-[10px] py-0.5 px-2 font-medium">
                        {opt.tag}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-title text-base font-bold text-[#0b1c30] group-hover:text-[#006e2f] transition-colors flex items-center justify-between">
                        <span>{opt.title}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#006e2f] group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="font-subtitle text-[11px] font-semibold text-gray-500 mt-0.5">
                        {opt.subtitle}
                      </p>
                    </div>

                    <p className="font-body text-xs text-gray-600 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#006e2f] font-semibold">
                    <span>Configurar cotización</span>
                    <span className="text-gray-400 group-hover:text-[#006e2f] text-xs">→</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center gap-2.5 text-xs text-emerald-900">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0" />
            <span>
              Todas las solicitudes se registran en estado <strong>Pendiente</strong> en la base de datos oficial para evaluación actuarial e inspección preventiva.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
