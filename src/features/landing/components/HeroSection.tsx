import React from 'react';
import { ArrowRight, Headphones, Shield, Zap, LifeBuoy, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export interface HeroSectionProps {
  onExplorePlan?: () => void;
  onAdvisorClick?: () => void;
  onOpenCotizador?: () => void;
}

/**
 * HeroSection Component
 * 
 * Main landing hero section featuring the expanded background mesh image,
 * Google Sans Flex typography for titles, Outfit for subtitles, and Lexend for body.
 *
 * @component
 * @layer Feature Component
 * @module features/landing/components/HeroSection
 * 
 * @param {HeroSectionProps} props - Component properties.
 * @returns {React.ReactElement} Hero section element.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplorePlan,
  onAdvisorClick,
  onOpenCotizador,
}) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Expanded Background Image Provided by User */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-transform duration-1000 scale-[1.01]"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />

      {/* Subtle Gentle Overlay for Contrast without blurring the image */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9ff]/75 via-[#f8f9ff]/35 to-transparent z-0 pointer-events-none" />
      
      {/* Bottom Gradient Fade into Page Background */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff]/60 to-transparent z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left Column: Main Headline Content */}
          <div className="w-full lg:w-3/5 flex flex-col items-start text-left">
            {/* Subtitle Badge in Outfit */}
            <Badge
              variant="glass"
              icon={<ShieldCheck className="w-4 h-4 text-[#006e2f]" />}
              className="mb-6 animate-slide-up font-subtitle text-xs uppercase tracking-wider font-semibold border-[#22c55e]/30 bg-white/70 shadow-sm"
            >
              SECURED BY HUMANS FOR HUMANS
            </Badge>

            {/* Main Title in Google Sans Flex */}
            <h1 className="font-title text-4xl sm:text-5xl lg:text-6xl font-black text-[#0b1c30] tracking-tight leading-[1.12] animate-slide-up">
              Protegemos lo que más valoras: <br />
              <span className="text-[#006e2f] mt-2 inline-block drop-shadow-sm">
                Tu vida, tu hogar, tu futuro.
              </span>
            </h1>

            {/* Subtitle in Outfit */}
            <p className="font-subtitle text-lg sm:text-xl text-[#2d3b2d] max-w-xl mt-6 font-medium leading-relaxed animate-slide-up">
              Seguridad y confianza inquebrantable para cada etapa de tu camino. Soluciones de
              seguros modernas, claras y transparentes diseñadas para tu tranquilidad absoluta.
            </p>

            {/* Action Buttons in Lexend */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto animate-slide-up">
              <Button
                variant="primary"
                size="lg"
                glow
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={onOpenCotizador || onExplorePlan}
                className="w-full sm:w-auto font-body shadow-xl shadow-[#22c55e]/30"
              >
                Descubre tu plan
              </Button>

              <Button
                variant="glass"
                size="lg"
                rightIcon={<Headphones className="w-5 h-5 text-[#006e2f]" />}
                onClick={onAdvisorClick}
                className="w-full sm:w-auto font-body bg-white/80 hover:bg-white border-[#22c55e]/40 shadow-sm"
              >
                Habla con un asesor
              </Button>
            </div>
          </div>

          {/* Right Column: Asymmetric Floating Cards (Desktop) */}
          <div className="w-full lg:w-2/5 relative min-h-[480px] lg:min-h-[520px] hidden md:block">
            {/* Card 1: Cobertura Total (Por encima de Gestión Rápida con texto 100% despejado) */}
            <div className="absolute top-0 right-2 lg:right-4 w-72 animate-float-1 z-30">
              <Card variant="glass-surface" className="p-6 bg-white/85 backdrop-blur-xl border-white/85 shadow-xl shadow-[#0b1c30]/5">
                <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/20 flex items-center justify-center border border-[#22c55e]/40 mb-4 text-[#006e2f] shadow-inner">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-title text-lg font-bold text-[#0b1c30] mb-1.5">Cobertura Total</h3>
                <p className="font-body text-xs text-[#3d4a3d] leading-relaxed">
                  Planes adaptables que cubren salud, vida y patrimonio con respaldo ágil.
                </p>
              </Card>
            </div>

            {/* Card 2: Gestión Rápida (Solapada en su esquina superior derecha bajo Card 1, texto totalmente libre) */}
            <div className="absolute top-[135px] -left-2 lg:-left-6 w-80 animate-float-2 z-10">
              <Card variant="glass-surface" className="p-6 pb-7 bg-white/80 backdrop-blur-xl border-white/90 shadow-2xl shadow-[#0b1c30]/8">
                <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/20 flex items-center justify-center border border-[#22c55e]/40 mb-4 text-[#006e2f] shadow-inner">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-title text-lg font-bold text-[#0b1c30] mb-1.5">Gestión Rápida</h3>
                <p className="font-body text-xs text-[#3d4a3d] leading-relaxed">
                  Procesos digitales 100% transparentes, paperless y sin burocracia.
                </p>
              </Card>
            </div>

            {/* Card 3: Soporte 24/7 (Solapa sutilmente el borde inferior de Card 2 por debajo de su texto) */}
            <div className="absolute top-[292px] right-0 lg:right-2 w-72 animate-float-3 z-20">
              <Card variant="glass-surface" className="p-6 bg-white/85 backdrop-blur-xl border-white/85 shadow-xl shadow-[#0b1c30]/5">
                <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/20 flex items-center justify-center border border-[#22c55e]/40 mb-4 text-[#006e2f] shadow-inner">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <h3 className="font-title text-lg font-bold text-[#0b1c30] mb-1.5">Soporte 24/7</h3>
                <p className="font-body text-xs text-[#3d4a3d] leading-relaxed">
                  Asistencia inmediata y auxilio mecánico en cualquier punto del país.
                </p>
              </Card>
            </div>
          </div>

          {/* Mobile Fallback Cards (Stacked) */}
          <div className="w-full md:hidden flex flex-col gap-4 mt-6">
            <Card variant="glass-surface" className="p-5 flex items-center gap-4 bg-white/85">
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/20 flex items-center justify-center shrink-0 border border-[#22c55e]/40 text-[#006e2f]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-title text-base font-bold text-[#0b1c30]">Cobertura Total</h3>
                <p className="font-body text-xs text-[#3d4a3d]">Salud, vida y patrimonio asegurados.</p>
              </div>
            </Card>

            <Card variant="glass-surface" className="p-5 flex items-center gap-4 bg-white/85">
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/20 flex items-center justify-center shrink-0 border border-[#22c55e]/40 text-[#006e2f]">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-title text-base font-bold text-[#0b1c30]">Gestión Rápida</h3>
                <p className="font-body text-xs text-[#3d4a3d]">Procesos 100% digitales y transparentes.</p>
              </div>
            </Card>

            <Card variant="glass-surface" className="p-5 flex items-center gap-4 bg-white/85">
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/20 flex items-center justify-center shrink-0 border border-[#22c55e]/40 text-[#006e2f]">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-title text-base font-bold text-[#0b1c30]">Soporte 24/7</h3>
                <p className="font-body text-xs text-[#3d4a3d]">Asistencia en todo momento.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
