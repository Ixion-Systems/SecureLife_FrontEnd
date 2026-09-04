import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  FileCheck,
  Truck,
  Award,
  Sparkles,
  Layers,
  Clock,
  Wrench,
  UserCheck,
  Lock,
  Headphones,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GeometryCanvas } from '@/components/animations/GeometryCanvas';

export interface AboutUsSectionProps {
  onExploreCoverage?: () => void;
}

interface CompanyFact {
  id: string;
  metric: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

const FACTS_COLUMN_1: CompanyFact[] = [
  {
    id: 'f1',
    metric: '+50.000 Pólizas Activas',
    description: 'Familias, vehículos y patrimonios protegidos en todo el país con respuesta inmediata.',
    badge: 'Alcance Nacional',
    icon: <ShieldCheck className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f2',
    metric: '< 2h Peritaje con IA',
    description: 'Inspección digital fotográfica asistida por visión computacional para siniestros express.',
    badge: 'Insurtech IA',
    icon: <Zap className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f3',
    metric: '100% Digital & Paperless',
    description: 'Emisión, firma y gestión de reclamos sin traslados ni imprimir un solo papel.',
    badge: 'Cero Papel',
    icon: <FileCheck className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f4',
    metric: '1.200+ Móviles de Auxilio',
    description: 'Grúas y mecánica ligera geolocalizadas para asistirte en minutos en cualquier ruta.',
    badge: 'Auxilio 24/7',
    icon: <Truck className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f5',
    metric: 'Calificación AAA',
    description: 'Máxima solidez patrimonial y reaseguro global que aseguran tu indemnización.',
    badge: 'Seguridad Financiera',
    icon: <Award className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f6',
    metric: '99.4% Dictámenes Favorables',
    description: 'Resolución justa y pago sin demoras ni letra chica oculta en el contrato.',
    badge: 'Transparencia',
    icon: <Sparkles className="w-5 h-5 text-[#006e2f]" />,
  },
];

const FACTS_COLUMN_2: CompanyFact[] = [
  {
    id: 'f7',
    metric: '4 Ramos en 1 Sola App',
    description: 'Automotor, Hogar, Vida y Objetos tecnológicos centralizados en tu panel personal.',
    badge: 'Cobertura 360°',
    icon: <Layers className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f8',
    metric: 'Cotización en 3 Minutos',
    description: 'Simulador instantáneo sin formularios interminables ni llamadas invasivas.',
    badge: 'Velocidad Récord',
    icon: <Clock className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f9',
    metric: '800+ Talleres Homologados',
    description: 'Red oficial de chapa, pintura y reposición directa de cristales en todo el territorio.',
    badge: 'Red Oficial',
    icon: <Wrench className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f10',
    metric: 'Productores Matriculados',
    description: 'Validación técnica por profesionales certificados por la Superintendencia de Seguros.',
    badge: 'Aval Oficial',
    icon: <UserCheck className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f11',
    metric: 'Seguridad Biométrica',
    description: 'Protección de accesos con cifrado bancario de 256 bits y autenticación multifactor.',
    badge: 'Ciberseguridad',
    icon: <Lock className="w-5 h-5 text-[#006e2f]" />,
  },
  {
    id: 'f12',
    metric: 'Asesor Dedicado 24/7',
    description: 'Atención personalizada por WhatsApp y llamada directa sin bots frustrantes.',
    badge: 'Trato Humano',
    icon: <Headphones className="w-5 h-5 text-[#006e2f]" />,
  },
];

/**
 * AboutUsSection Component
 * 
 * Company background featuring a two-column infinite vertical marquee carousel
 * (Column 1 scrolls UP, Column 2 scrolls DOWN) with interactive hover pause,
 * geometric constellation canvas, Google Sans Flex titles, and Outfit subtitles.
 *
 * @component
 * @layer Feature Component
 * @module features/landing/components/AboutUsSection
 * 
 * @param {AboutUsSectionProps} props - Component properties.
 * @returns {React.ReactElement} About us section element.
 */
export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ onExploreCoverage }) => {
  // Duplicamos los elementos para generar un bucle infinito continuo e impecable
  const infiniteColumn1 = [...FACTS_COLUMN_1, ...FACTS_COLUMN_1];
  const infiniteColumn2 = [...FACTS_COLUMN_2, ...FACTS_COLUMN_2];

  return (
    <section id="sobre-nosotros" className="min-h-screen flex flex-col justify-center py-20 px-6 md:px-12 relative overflow-hidden bg-[#f8f9ff]">
      {/* Interactive Constellation Geometry Canvas Background */}
      <GeometryCanvas />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Mission, Vision, and Metrics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left animate-slide-up">
            <Badge variant="primary" className="mb-6 font-subtitle text-xs uppercase tracking-wider font-semibold">
              SOBRE SECURELIFE
            </Badge>

            <h2 className="font-title text-3xl md:text-5xl font-black text-[#0b1c30] mb-4 leading-tight tracking-tight">
              Transformando el mundo de los seguros desde 2026
            </h2>

            <h3 className="font-subtitle text-xl font-bold text-[#006e2f] mb-6">
              Nacimos con una misión clara: protegerte sin fricciones.
            </h3>

            <p className="font-body text-base text-gray-600 mb-8 leading-relaxed">
              En SecureLife combinamos tecnología de vanguardia con un trato humano excepcional
              para ofrecerte coberturas que realmente se adaptan a tus necesidades. Sin letra
              chica, sin procesos engorrosos y con resolución inmediata.
            </p>

            {/* Statistics Counters */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-7 mb-10 pb-8 border-b border-gray-200/80 w-full">
              <div className="text-left">
                <div className="font-title text-3xl font-black text-[#0b1c30]">2026</div>
                <div className="font-subtitle text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                  Fundación
                </div>
              </div>

              <div className="hidden sm:block w-px h-10 bg-gray-300" />

              <div className="text-left">
                <div className="font-title text-3xl font-black text-[#0b1c30]">4</div>
                <div className="font-subtitle text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                  Ramos
                </div>
              </div>

              <div className="hidden sm:block w-px h-10 bg-gray-300" />

              <div className="text-left">
                <div className="font-title text-3xl font-black text-[#0b1c30]">100%</div>
                <div className="font-subtitle text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                  Online
                </div>
              </div>

              <div className="hidden sm:block w-px h-10 bg-gray-300" />

              <div className="text-left">
                <div className="font-title text-3xl font-black text-[#0b1c30]">24/7</div>
                <div className="font-subtitle text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                  Soporte
                </div>
              </div>
            </div>

            <p className="font-subtitle text-lg text-[#0b1c30] font-semibold mb-8">
              Protegemos tu presente, aseguramos tu futuro.
            </p>

            <Button
              variant="primary"
              size="lg"
              glow
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={onExploreCoverage}
              className="font-body shadow-lg shadow-[#22c55e]/25"
            >
              Conocé nuestras coberturas
            </Button>
          </div>

          {/* Right Column: Two-Column Vertical Carousel (7 cols) */}
          <div className="lg:col-span-7 relative h-[600px] md:h-[660px] overflow-hidden marquee-vertical-mask py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 h-full">
              {/* Column 1: Scrolling UP */}
              <div className="relative overflow-hidden h-full flex flex-col group bg-transparent">
                <div className="animate-marquee-up flex flex-col gap-6 bg-transparent">
                  {infiniteColumn1.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-white/90 shadow-none hover:border-[#22c55e]/50 hover:bg-white transition-all duration-300 cursor-default"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#22c55e]/15 flex items-center justify-center border border-[#22c55e]/30 shadow-inner">
                          {item.icon}
                        </div>
                        <span className="font-subtitle text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#006e2f]/10 text-[#006e2f]">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="font-title text-base font-bold text-[#0b1c30] mb-1.5 leading-snug">
                        {item.metric}
                      </h4>
                      <p className="font-body text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Scrolling DOWN */}
              <div className="relative overflow-hidden h-full flex flex-col group bg-transparent">
                <div className="animate-marquee-down flex flex-col gap-6 bg-transparent">
                  {infiniteColumn2.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-white/90 shadow-none hover:border-[#22c55e]/50 hover:bg-white transition-all duration-300 cursor-default"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#22c55e]/15 flex items-center justify-center border border-[#22c55e]/30 shadow-inner">
                          {item.icon}
                        </div>
                        <span className="font-subtitle text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#006e2f]/10 text-[#006e2f]">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="font-title text-base font-bold text-[#0b1c30] mb-1.5 leading-snug">
                        {item.metric}
                      </h4>
                      <p className="font-body text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtle Gradient Fog Indicator at Top & Bottom */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#f8f9ff] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#f8f9ff] to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
