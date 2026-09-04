import React from 'react';
import { Car, Home, Heart, Smartphone, Info, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { WaveCanvas } from '@/components/animations/WaveCanvas';
import { CoverageCard } from './CoverageCard';

export interface ServicesSectionProps {
  onSelectCoverage?: (category: string) => void;
}

/**
 * ServicesSection Component
 * 
 * Displays the 4 primary insurance branches covered by SecureLife,
 * animated wave canvas background, and quick estimation disclaimer.
 *
 * @component
 * @layer Feature Component
 * @module features/landing/components/ServicesSection
 * 
 * @param {ServicesSectionProps} props - Component properties.
 * @returns {React.ReactElement} Services section element.
 */
export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectCoverage }) => {
  return (
    <section id="servicios" className="min-h-screen flex flex-col justify-center py-20 bg-[#f8f9ff] px-6 md:px-12 relative overflow-hidden">
      {/* Dynamic Sine Wave Canvas Background */}
      <WaveCanvas />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 animate-slide-up">
          <Badge variant="primary" className="mb-4 font-subtitle text-xs uppercase tracking-wider font-semibold">
            NUESTRAS COBERTURAS
          </Badge>
          <h2 className="font-title text-3xl md:text-5xl font-extrabold text-[#0b1c30] mb-4 tracking-tight">
            Soluciones de protección diseñadas a tu medida
          </h2>
          <p className="font-subtitle text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Simulá tu cobertura online en segundos o solicitá una póliza formal validada por
            nuestros productores matriculados.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Automotor */}
          <CoverageCard
            categoryBadge="Más Popular"
            isPopular
            icon={<Car className="w-7 h-7 text-[#006e2f]" />}
            title="Seguro Automotor"
            description="Protección total para autos y motos contra terceros, robo, incendio, cristales y granizo con peritaje ágil."
            features={[
              'Auxilio mecánico y grúa 24/7',
              'Seguimiento online de siniestros',
              'Cobertura de cristales y cerraduras',
            ]}
            ctaText="Cotizar Vehículo"
            onCtaClick={() => onSelectCoverage?.('auto')}
          />

          {/* Card 2: Hogar */}
          <CoverageCard
            categoryBadge="Patrimonial"
            icon={<Home className="w-7 h-7 text-[#006e2f]" />}
            title="Seguro de Hogar"
            description="Cuidá tu vivienda y bienes frente a incendios, daños por agua, robo y responsabilidad civil comprensiva."
            features={[
              'Asistencia domiciliaria de urgencia',
              'Cobertura de electrodomésticos',
              'Responsabilidad civil linderos',
            ]}
            ctaText="Cotizar Hogar"
            onCtaClick={() => onSelectCoverage?.('home')}
          />

          {/* Card 3: Vida */}
          <CoverageCard
            categoryBadge="Familiar"
            icon={<Heart className="w-7 h-7 text-[#006e2f]" />}
            title="Seguro de Vida"
            description="Respaldo y tranquilidad económica para vos y tu familia con indemnización rápida y libre designación de beneficiarios."
            features={[
              'Cobertura por accidentes personales',
              'Sin exámenes médicos complejos',
              'Renta por internación hospitalaria',
            ]}
            ctaText="Cotizar Vida"
            onCtaClick={() => onSelectCoverage?.('life')}
          />

          {/* Card 4: Objetos & Tech */}
          <CoverageCard
            categoryBadge="Movilidad & Tech"
            icon={<Smartphone className="w-7 h-7 text-[#006e2f]" />}
            title="Seguro de Objetos"
            description="Asegurá tus dispositivos portátiles, notebooks, smartphones, bicicletas y monopatines ante robo en vía pública."
            features={[
              'Cobertura en la vía pública',
              'Reposición ágil del equipo',
              'Daño accidental por caídas',
            ]}
            ctaText="Cotizar Objetos"
            onCtaClick={() => onSelectCoverage?.('tech')}
          />
        </div>

        {/* Footer Disclaimer Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5 text-sm text-gray-600 font-body">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <p>
              Simulación estimativa instantánea sin registro previo. Los costos finales son
              validados por un productor matriculado.
            </p>
          </div>
          <a
            href="#sobre-nosotros"
            className="text-[#006e2f] font-subtitle font-semibold text-sm hover:underline whitespace-nowrap flex items-center gap-1.5 shrink-0"
          >
            <span>Conocé cómo funciona nuestro proceso</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
