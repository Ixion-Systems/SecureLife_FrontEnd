import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WelcomeHeroProps {
  userName: string;
  activePoliciesCount?: number;
  onExplorePolicies: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  userName,
  activePoliciesCount = 0,
  onExplorePolicies,
}) => {
  const firstName = userName.split(' ')[0] || 'Asegurado';
  const hasCoverage = activePoliciesCount > 0;

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#003817] via-[#004b1e] to-[#006e2f] text-white p-6 sm:p-8 shadow-xl shadow-[#004b1e]/15">
      {/* Ambient background glows */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#22c55e]/20 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-[#4ade80]/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-subtitle text-emerald-200 backdrop-blur-md">
            <span
              className={`w-2 h-2 rounded-full ${
                hasCoverage ? 'bg-[#22c55e] animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>
              {hasCoverage
                ? `Protección Activa (${activePoliciesCount} ${activePoliciesCount === 1 ? 'póliza' : 'pólizas'}) • Aseguradora N° 0842 SSN`
                : 'Sin Pólizas Activas • Aseguradora Regulada N° 0842 SSN'}
            </span>
          </div>

          <h1 className="font-title text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            ¡Hola de nuevo, {firstName}!
          </h1>

          <p className="font-body text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {hasCoverage
              ? 'Tu patrimonio y tranquilidad están asegurados con SecureLife. Gestiona tus coberturas, asistencias satelitales y documentación oficial en tiempo real.'
              : 'Aún no posees pólizas activas en tu cuenta. Cotiza y asegura tu vehículo o inmueble en simples pasos para contar con respaldo integral.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={onExplorePolicies}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#004b1e] font-subtitle font-bold text-xs sm:text-sm shadow-lg hover:bg-emerald-50 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>Ver Mis Pólizas</span>
            <ArrowRight className="w-4 h-4 text-[#006e2f]" />
          </button>
        </div>
      </div>
    </div>
  );
};
