import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export interface PageIntroLoaderProps {
  onComplete?: () => void;
  /** Set to false to disable intro animation without removing code */
  enabled?: boolean;
}

/**
 * Global toggle to easily enable or disable the intro animation
 * without losing any code or configuration.
 */
export const ENABLE_PAGE_INTRO = true;

/**
 * PageIntroLoader Component
 * 
 * High-performance, cinematic brand entrance animation with GSAP 3+:
 * 1. Base deep brand green screen (#005321).
 * 2. Expanding rounded white rectangle (0.95s).
 * 3. Second lighter green rectangle (#16a34a -> #22c55e -> #4ade80) starts at 75% progress.
 * 4. Closed padlock logo (LOGO.svg) emerges cleanly without text.
 * 5. Tactile unlatch: pops open to LOGO_ALTER.svg with an expanding radiant ripple wave.
 * 6. Transparent aperture dissolves smoothly into the landing page.
 * Includes body scroll locking, GPU layer promotion, and prefers-reduced-motion support.
 *
 * @component
 * @layer Presentation / Animation
 * @module components/animations/PageIntroLoader
 * 
 * @param {PageIntroLoaderProps} props - Component properties.
 * @returns {React.ReactElement | null} The intro overlay element.
 */
export const PageIntroLoader: React.FC<PageIntroLoaderProps> = ({
  onComplete,
  enabled = ENABLE_PAGE_INTRO,
}) => {
  const [isVisible, setIsVisible] = useState(enabled);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const whiteRectRef = useRef<HTMLDivElement>(null);
  const greenRectRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Accessibility check: immediately skip if user prefers reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

    if (!enabled || prefersReducedMotion) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Lock page scroll while loader is active to keep hero section in place
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finishIntro = () => {
      document.body.style.overflow = originalOverflow;
      setIsVisible(false);
      onComplete?.();
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: finishIntro,
      });

      // Initial element states (pulseRing is completely hidden so no static circle ever appears)
      gsap.set(whiteRectRef.current, { scale: 0, opacity: 0, borderRadius: '56px' });
      gsap.set(greenRectRef.current, { scale: 0, opacity: 0, borderRadius: '56px' });
      gsap.set(logoContainerRef.current, { opacity: 0, scale: 0.6, y: 12 });
      gsap.set(pulseRingRef.current, { display: 'none', scale: 0.6, opacity: 0 });

      // 1. Rectángulo blanco: expande en 0.95s con aceleración orgánica
      tl.to(whiteRectRef.current, {
        scale: 1.3,
        opacity: 1,
        borderRadius: '28px',
        duration: 0.95,
        ease: 'power2.inOut',
      })

      // 2. Rectángulo verde más claro: arranca exactamente cuando el blanco está en el 75% de su recorrido (-=0.24s)
      .to(
        greenRectRef.current,
        {
          scale: 1.3,
          opacity: 1,
          borderRadius: '28px',
          duration: 0.95,
          ease: 'power2.inOut',
        },
        '-=0.24'
      )

      // 3. Emerge el candado cerrado normal (LOGO.svg) a medida que el verde cubre la pantalla
      .to(
        logoContainerRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'back.out(1.5)',
        },
        '-=0.2'
      )

      // 4. Desbloqueo táctil del candado:
      // A. Micro-compresión
      .to(logoContainerRef.current, {
        scale: 0.92,
        y: 4,
        duration: 0.14,
        ease: 'power2.in',
      })
      // B. Rebote elástico y apertura del grillete (swap a LOGO_ALTER.svg)
      .to(logoContainerRef.current, {
        scale: 1.14,
        y: -6,
        duration: 0.24,
        ease: 'back.out(2.4)',
        onStart: () => {
          setIsUnlocked(true);
        },
      })
      // C. Solo la onda que se expande hacia afuera (aparece únicamente aquí)
      .set(pulseRingRef.current, { display: 'block', scale: 0.75, opacity: 0.9 })
      .to(
        pulseRingRef.current,
        {
          scale: 3.8,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '<'
      )
      // D. El candado abierto se asienta con serenidad
      .to(logoContainerRef.current, {
        scale: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      })

      // Breve pausa para apreciar el candado abierto
      .to({}, { duration: 0.25 })

      // 5. Capa transparente y revelado hacia la página
      .to(logoContainerRef.current, {
        scale: 1.18,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      })
      .to(
        greenRectRef.current,
        {
          scale: 2.15,
          opacity: 0,
          borderRadius: '9999px',
          duration: 0.55,
          ease: 'power3.inOut',
        },
        '-=0.25'
      )
      .to(
        whiteRectRef.current,
        {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
        },
        '-=0.45'
      )
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
        },
        '-=0.2'
      );
    }, containerRef);

    return () => {
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, [enabled, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      aria-label="SecureLife Intro Animation"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#005321] overflow-hidden pointer-events-auto select-none"
    >
      {/* 1. Rectángulo Blanco Expandible */}
      <div
        ref={whiteRectRef}
        style={{ willChange: 'transform, opacity' }}
        className="absolute w-[108vw] h-[108vh] bg-white shadow-2xl origin-center"
      />

      {/* 2. Rectángulo Verde Más Claro (#16a34a -> #22c55e -> #4ade80) */}
      <div
        ref={greenRectRef}
        style={{ willChange: 'transform, opacity' }}
        className="absolute w-[108vw] h-[108vh] bg-gradient-to-tr from-[#16a34a] via-[#22c55e] to-[#4ade80] shadow-2xl origin-center"
      />

      {/* 3. Onda de Pulso que solo existe al expandirse */}
      <div
        ref={pulseRingRef}
        style={{ display: 'none', willChange: 'transform, opacity' }}
        className="absolute w-32 h-32 rounded-full border-2 border-white shadow-[0_0_30px_#ffffff] pointer-events-none z-10"
      />

      {/* 4. Contenedor de Logo Central con Base Anclada */}
      <div
        ref={logoContainerRef}
        style={{ willChange: 'transform, opacity' }}
        className="relative z-20 flex items-center justify-center"
      >
        <div className="w-24 h-28 sm:w-28 sm:h-32 flex items-end justify-center drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)] relative">
          {isUnlocked ? (
            <img
              src="/LOGO_ALTER.svg"
              alt="SecureLife Unlocked Padlock Logo"
              className="w-full h-auto max-h-full object-contain filter drop-shadow-lg"
            />
          ) : (
            <img
              src="/LOGO.svg"
              alt="SecureLife Closed Padlock Logo"
              className="w-full h-auto max-h-full object-contain filter drop-shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};
