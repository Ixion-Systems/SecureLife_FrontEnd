import {
  Sparkles,
  Percent,
  Award,
  ShieldCheck,
  ShieldPlus,
  CheckCircle2,
  Car,
  CloudHail,
  Disc,
  Smartphone,
  Wallet,
  Globe,
  QrCode,
  FileCheck,
} from 'lucide-react';
import type { AuthCarouselSlide } from '../components/AuthCarousel';

/**
 * Sign Up carousel slides dataset.
 * Adheres strictly to:
 * - NO action buttons inside the slides or graphics.
 * - EXCLUSIVELY Lucide React vector icons.
 * - Conceptual cards, metrics, and badges.
 */
export const SIGNUP_SLIDES: AuthCarouselSlide[] = [
  {
    id: 'slide-bienvenida-off',
    badge: 'Beneficio de Bienvenida',
    badgeIcon: <Sparkles className="w-3.5 h-3.5" />,
    title: 'Bienvenida Exclusiva 15% OFF',
    description:
      'Comienza protegido desde el primer minuto con una bonificación especial en tus primeras cuotas y respaldo oficial.',
    graphic: (
      <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl text-left">
        {/* Digital Voucher Card */}
        <div className="relative p-4 rounded-xl bg-gradient-to-br from-emerald-600/30 to-emerald-950/60 border border-emerald-400/30 overflow-hidden mb-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                Voucher Digital
              </span>
              <p className="text-xl font-title font-black text-white mt-0.5">
                15% OFF
              </p>
              <p className="text-xs text-white/80">
                En tus primeras 3 cuotas
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center text-emerald-300">
              <Percent className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-dashed border-white/20 flex items-center justify-between text-[11px]">
            <span className="text-white/60">Código de cupón:</span>
            <span className="font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-emerald-200">
              SECURE15OFF
            </span>
          </div>
        </div>

        {/* SSN official certificate & transparency info */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[#22c55e] shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <span>Certificado Oficial SSN N° 0842</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
            </p>
            <p className="text-white/60 text-[11px]">
              Superintendencia de Seguros de la Nación
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'slide-coberturas-claras',
    badge: 'Sin Letra Chica',
    badgeIcon: <ShieldPlus className="w-3.5 h-3.5" />,
    title: 'Coberturas Claras y Sin Franquicia',
    description:
      'Comparativa de beneficios reales creados para que conduzcas tranquilo, sin gastos sorpresa ni demoras burocráticas.',
    graphic: (
      <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl text-left">
        <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
          Ventajas Exclusivas SecureLife
        </p>

        {/* Benefits list without buttons */}
        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <CloudHail className="w-4 h-4 text-emerald-300 shrink-0" />
            <div>
              <span className="font-semibold text-white block">Granizo e Inundación</span>
              <span className="text-[11px] text-white/60">100% de cobertura sin límite ni tope</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <Disc className="w-4 h-4 text-emerald-300 shrink-0" />
            <div>
              <span className="font-semibold text-white block">Reposición de Cubiertas</span>
              <span className="text-[11px] text-white/60">A nuevo sin depreciación por desgaste</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <Car className="w-4 h-4 text-emerald-300 shrink-0" />
            <div>
              <span className="font-semibold text-white block">Auto Sustituto Garantizado</span>
              <span className="text-[11px] text-white/60">Disponibilidad inmediata por hasta 10 días</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'slide-poliza-celular',
    badge: 'Ecosistema Móvil',
    badgeIcon: <Smartphone className="w-3.5 h-3.5" />,
    title: 'Póliza Directo en tu Celular',
    description:
      'Agrega tu seguro a Apple Wallet y Google Wallet al instante. Certificado Mercosur digital 100% oficial para viajar tranquilo.',
    graphic: (
      <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl text-left">
        {/* Smartphone wallet pass conceptual mockup */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 mb-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#22c55e]" />
              <span className="text-xs font-semibold text-white">Apple & Google Wallet</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              <FileCheck className="w-3 h-3 text-[#22c55e]" />
              Verificado
            </span>
          </div>

          <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/10">
            <div>
              <p className="text-[11px] text-white/60">Certificado de Tránsito</p>
              <p className="text-xs font-bold text-white">Mercosur Digital 2026</p>
            </div>
            <QrCode className="w-8 h-8 text-emerald-300" />
          </div>
        </div>

        {/* Global Travel Coverage Badge */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-[11px] text-white/80">
            Validez legal inmediata en <strong className="text-white">Argentina, Brasil, Uruguay y Chile</strong>.
          </p>
        </div>
      </div>
    ),
  },
];
