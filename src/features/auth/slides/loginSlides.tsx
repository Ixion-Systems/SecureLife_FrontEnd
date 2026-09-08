import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  Radar,
  CloudLightning,
  Activity,
  Truck,
  MapPin,
  Timer,
  ShieldAlert,
} from 'lucide-react';
import type { AuthCarouselSlide } from '../components/AuthCarousel';

/**
 * Login carousel slides dataset.
 * Adheres strictly to:
 * - NO action buttons inside the slides or graphics.
 * - EXCLUSIVELY Lucide React vector icons.
 * - Conceptual cards, metrics, and badges.
 */
export const LOGIN_SLIDES: AuthCarouselSlide[] = [
  {
    id: 'slide-poliza-digital',
    badge: 'Póliza 100% Digital',
    badgeIcon: <ShieldCheck className="w-3.5 h-3.5" />,
    title: 'Tu Póliza Digital Siempre Contigo',
    description:
      'Accede a toda tu documentación vehicular, certificados de cobertura y asistencia inmediata las 24 horas desde cualquier dispositivo.',
    graphic: (
      <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl text-left transition-all">
        {/* Header with status */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/25 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-subtitle uppercase tracking-wider">Póliza Oficial</p>
              <p className="text-sm font-semibold text-white">POL-AR-883921-X</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
            Vigente
          </span>
        </div>

        {/* Policy details preview */}
        <div className="space-y-2.5 mb-4 text-xs">
          <div className="flex justify-between text-white/80">
            <span className="text-white/50">Titular:</span>
            <span className="font-medium text-white">Nicolás Fernández</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span className="text-white/50">Vehículo:</span>
            <span className="font-medium text-white">Corolla Cross 2.0 SEG</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span className="text-white/50">Plan:</span>
            <span className="font-semibold text-emerald-300">Todo Riesgo Premium</span>
          </div>
        </div>

        {/* Feature Badges without buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
            <div className="text-[11px] leading-tight text-white/90">
              <span className="font-bold text-white block">99.4%</span>
              <span className="text-white/60">Siniestros resueltos</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-[11px] leading-tight text-white/90">
              <span className="font-bold text-white block">24/7</span>
              <span className="text-white/60">Asistencia en ruta</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'slide-alertas-climaticas',
    badge: 'Tecnología Predictiva',
    badgeIcon: <Radar className="w-3.5 h-3.5" />,
    title: 'Prevención y Alertas Climáticas',
    description:
      'Radar preventivo contra granizo y temporales en tiempo real. Recibe avisos anticipados para resguardar tu vehículo.',
    graphic: (
      <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl text-left">
        {/* Radar conceptual animation & status */}
        <div className="relative flex items-center justify-center p-4 mb-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 overflow-hidden">
          {/* Radar background circles */}
          <div className="w-32 h-32 rounded-full border border-emerald-500/25 flex items-center justify-center relative">
            <div className="w-20 h-20 rounded-full border border-emerald-500/35 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-emerald-400/50 bg-emerald-500/10 flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
            </div>
            {/* Rotating radar sweep */}
            <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400/80 animate-spin [animation-duration:4s] pointer-events-none" />
            {/* Blip dots */}
            <span className="absolute top-4 right-6 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            <span className="absolute bottom-6 left-5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/20">
            <Activity className="w-3 h-3 text-[#22c55e] animate-pulse" />
            <span>Radar Activo</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-white/80">Score de Protección</span>
            </div>
            <span className="text-xs font-bold text-white bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
              98 / 100
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <CloudLightning className="w-4 h-4 text-yellow-300" />
              <span className="text-xs text-white/80">Alerta Granizo</span>
            </div>
            <span className="text-xs font-semibold text-emerald-300">
              Zona Segura (0% riesgo hoy)
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'slide-auxilio-satelital',
    badge: 'Asistencia Federal',
    badgeIcon: <Truck className="w-3.5 h-3.5" />,
    title: 'Auxilio Mecánico Satelital',
    description:
      'Simulación de despacho de grúa con tiempo de respuesta veloz y geolocalización satelital en todo el país.',
    graphic: (
      <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl text-left">
        {/* Route simulation display */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Unidad de Auxilio #208</p>
                <p className="text-[11px] text-white/60 leading-tight mt-0.5">Grúa de plataforma hidráulica</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
              </span>
              <span>En Camino</span>
            </span>
          </div>

          {/* Dotted path with perfectly centered nodes and connecting line */}
          <div className="relative flex items-start gap-3.5 pt-1.5">
            {/* Route track: Node 1 -> Gradient line -> Node 2 */}
            <div className="flex flex-col items-center shrink-0 w-3 pt-0.5">
              {/* Node 1: Base Operativa Centro */}
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#003816] shadow-xs z-10" />
              {/* Connecting vertical route line */}
              <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-400 via-[#22c55e] to-emerald-300 my-0.5" />
              {/* Node 2: GPS Destination with pulsing radar ping AND solid core */}
              <div className="relative flex items-center justify-center z-10 w-3 h-3">
                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e] border-2 border-[#003816] shadow-[0_0_8px_#22c55e]" />
              </div>
            </div>

            {/* Route labels strictly aligned with track nodes */}
            <div className="flex flex-col justify-between h-full py-0 text-left space-y-3">
              <div>
                <p className="text-[11px] text-white/50 leading-none">Base Operativa Centro</p>
                <p className="text-xs font-semibold text-white mt-1 leading-tight">Despachado</p>
              </div>
              <div>
                <p className="text-[11px] text-white/50 leading-none">Tu Ubicación GPS</p>
                <p className="text-xs font-bold text-emerald-300 mt-1 leading-tight">Llegada estimada &lt; 15 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-[11px]">
              <span className="text-white/60 block">Tiempo medio</span>
              <span className="font-bold text-white">&lt; 15 min</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-[11px]">
              <span className="text-white/60 block">Cobertura</span>
              <span className="font-bold text-white">Todo el País</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];
