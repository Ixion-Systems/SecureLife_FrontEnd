import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Headset } from 'lucide-react';
import { InteractiveTiltCard } from '@/components/animations/InteractiveTiltCard';

export interface AuthCarouselSlide {
  id: string;
  badge: string;
  badgeIcon?: React.ReactNode;
  title: string;
  description: string;
  graphic: React.ReactNode;
}

export interface AuthCarouselProps {
  slides: AuthCarouselSlide[];
  autoPlayInterval?: number;
  className?: string;
  supportPhone?: string;
}

/**
 * AuthCarousel Component
 * 
 * Elegant right-panel split-screen carousel tailored for the Solara layout.
 * Features:
 * - Deep forest green gradient backdrop with ambient glowing orbs.
 * - Top header with 24/7 Support link and Headset icon.
 * - Conceptual cards, metrics, and badges strictly WITHOUT action buttons inside.
 * - Exclusively Lucide React vector icons.
 * - 5-second autoplay, pause on hover, and interactive pagination dots.
 *
 * @component
 * @layer Feature Component
 * @module features/auth/components/AuthCarousel
 * 
 * @param {AuthCarouselProps} props - Component properties.
 * @returns {React.ReactElement} Styled split-screen carousel panel.
 */
export const AuthCarousel: React.FC<AuthCarouselProps> = ({
  slides,
  autoPlayInterval = 5000,
  className = '',
  supportPhone = '0800-888-7328',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoPlayInterval, goToNext, slides.length]);

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#003816] via-[#004b1e] to-[#082214] text-white auth-carousel-container select-none ${className}`}
    >
      {/* Ambient background glowing orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#006e2f]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Bar: 24/7 Support */}
      <div className="relative z-10 flex items-center justify-between w-full shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
            Plataforma Segura SSL 256-Bit
          </span>
        </div>

        <a
          href={`tel:${supportPhone.replace(/[^0-9]/g, '')}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-200 group"
          title="Contacto con Centro de Asistencia"
        >
          <Headset className="w-4 h-4 text-[#22c55e] group-hover:scale-110 transition-transform" />
          <span>Soporte 24/7: <strong className="text-white">{supportPhone}</strong></span>
        </a>
      </div>

      {/* Center Slide Container */}
      <div className="relative z-10 my-auto py-2 max-w-xl w-full mx-auto flex flex-col items-center">
        {/* Dynamic Slide Transition */}
        <div
          key={activeSlide.id}
          className="w-full flex flex-col items-center text-center animate-scale-in"
        >
          {/* Conceptual Graphic Container with Interactive 3D Physics */}
          <div className="w-full auth-carousel-graphic-margin flex items-center justify-center">
            <InteractiveTiltCard maxTilt={8} scale={1.03}>
              {activeSlide.graphic}
            </InteractiveTiltCard>
          </div>

          {/* Slide Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide mb-2.5 sm:mb-3">
            {activeSlide.badgeIcon}
            <span>{activeSlide.badge}</span>
          </div>

          {/* Title */}
          <h2 className="font-title text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2 sm:mb-3">
            {activeSlide.title}
          </h2>

          {/* Description */}
          <p className="font-body text-sm lg:text-base text-emerald-100/80 leading-relaxed max-w-md mx-auto">
            {activeSlide.description}
          </p>
        </div>
      </div>

      {/* Bottom Controls: Interactive Pagination Dots */}
      <div className="relative z-10 flex items-center justify-between gap-4 pt-[clamp(0.75rem,2.5vh,1.5rem)] border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToIndex(index)}
                aria-label={`Ver diapositiva ${index + 1}: ${slide.title}`}
                className={`transition-all duration-300 rounded-full h-2.5 focus:outline-none focus:ring-2 focus:ring-[#22c55e] cursor-pointer ${
                  isActive
                    ? 'w-8 bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                    : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            );
          })}
        </div>

        <div className="text-xs text-white/50 font-subtitle tracking-wider">
          <span>{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="mx-1.5 opacity-40">/</span>
          <span>{String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
