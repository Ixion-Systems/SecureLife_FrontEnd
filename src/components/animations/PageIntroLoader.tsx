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
 * High-performance, cinematic brand intro loader built with GSAP 3+ and React 19:
 * - Brand Greens Palette: Deep forest canvas (#02150a), emerald auras (#006e2f, #22c55e), and neon accents (#4ade80).
 * - Anti-Flashbang: Zero pure-white full-screen blasts.
 * - Duration: Under 1.5s (strictly 1.30 seconds total).
 * - Choreography:
 *   1. Emergence: Concentric emerald rings and closed padlock (LOGO.svg) pop into view.
 *   2. Tactile Unlock: Micro-compression and energetic unlatch to open padlock (LOGO_ALTER.svg).
 *   3. Emerald Shockwave: Concentric circular pulse radiates outward.
 *   4. Seamless Reveal: Smooth aperture dissolve unveiling the landing page.
 * - Accessibility: Instant bypass on prefers-reduced-motion.
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
  const [isVisible, setIsVisible] = useState(() => {
    if (!enabled) return false;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    return true;
  });
  const [isUnlocked, setIsUnlocked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
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

      // Initial hardware-accelerated states (Zero Layout Thrashing)
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(auraRef.current, { scale: 0.5, opacity: 0 });
      gsap.set(ring1Ref.current, { scale: 0.4, opacity: 0 });
      gsap.set(ring2Ref.current, { scale: 0.3, opacity: 0, rotation: 0 });
      gsap.set(shockwaveRef.current, { scale: 0.5, opacity: 0 });
      gsap.set(logoContainerRef.current, { opacity: 0, scale: 0.6, y: 14 });
      gsap.set(brandTextRef.current, { opacity: 0, y: 10 });

      // PHASE 1 (0.0s -> 0.38s): Ambient Aura, Concentric Rings & Logo Emergence
      tl.to(auraRef.current, {
        scale: 1.15,
        opacity: 0.85,
        duration: 0.38,
        ease: 'power2.out',
      })
      .to(
        ring1Ref.current,
        {
          scale: 1,
          opacity: 0.5,
          duration: 0.36,
          ease: 'power2.out',
        },
        0.04
      )
      .to(
        ring2Ref.current,
        {
          scale: 1,
          opacity: 0.35,
          rotation: 45,
          duration: 0.4,
          ease: 'power2.out',
        },
        0.06
      )
      .to(
        logoContainerRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.38,
          ease: 'back.out(1.8)',
        },
        0.08
      )
      .to(
        brandTextRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.18
      )

      // PHASE 2 (0.38s -> 0.85s): Tactile Unlock & Emerald Shockwave
      // A. Micro-compression anticipation (0.08s)
      .to(logoContainerRef.current, {
        scale: 0.93,
        y: 2,
        duration: 0.08,
        ease: 'power1.in',
      })
      // B. Elastic kick & Padlock unlatch (swap to LOGO_ALTER.svg)
      .to(logoContainerRef.current, {
        scale: 1.12,
        y: -4,
        duration: 0.2,
        ease: 'back.out(2.2)',
        onStart: () => {
          setIsUnlocked(true);
        },
      })
      // C. Emerald Shockwave Burst
      .to(
        shockwaveRef.current,
        {
          opacity: 0.95,
          scale: 3.2,
          duration: 0.36,
          ease: 'power2.out',
        },
        '<'
      )
      .to(
        shockwaveRef.current,
        {
          opacity: 0,
          duration: 0.16,
          ease: 'power1.out',
        },
        '-=0.16'
      )
      // D. Ring 1 expands with wave
      .to(
        ring1Ref.current,
        {
          scale: 1.45,
          opacity: 0.15,
          duration: 0.32,
          ease: 'power2.out',
        },
        '<'
      )
      // E. Padlock settles into peaceful unlocked stance
      .to(logoContainerRef.current, {
        scale: 1,
        y: 0,
        duration: 0.18,
        ease: 'power2.out',
      })

      // PHASE 3 (0.85s -> 1.30s): Smooth Cinematic Dissolve into Landing
      .to(
        [logoContainerRef.current, brandTextRef.current],
        {
          scale: 1.08,
          y: -8,
          opacity: 0,
          duration: 0.28,
          ease: 'power2.in',
        },
        0.92
      )
      .to(
        [auraRef.current, ring1Ref.current, ring2Ref.current],
        {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
        },
        0.96
      )
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.32,
          ease: 'power2.inOut',
        },
        1.0
      );
    }, containerRef);

    return () => {
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Cargando SecureLife"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#02150a] overflow-hidden pointer-events-auto select-none"
    >
      {/* 1. Ambient Emerald Glow Aura */}
      <div
        ref={auraRef}
        style={{ willChange: 'transform, opacity' }}
        className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#006e2f]/50 via-[#22c55e]/30 to-transparent blur-3xl pointer-events-none"
      />

      {/* 2. Concentric Cyber Rings */}
      <div
        ref={ring1Ref}
        style={{ willChange: 'transform, opacity' }}
        className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-[#22c55e]/40 pointer-events-none shadow-[0_0_20px_rgba(34,197,94,0.15)]"
      />
      <div
        ref={ring2Ref}
        style={{ willChange: 'transform, opacity' }}
        className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-dashed border-[#4ade80]/25 pointer-events-none"
      />

      {/* 3. Emerald Shockwave Pulse Ring (Triggered on Padlock Unlock) */}
      <div
        ref={shockwaveRef}
        style={{ willChange: 'transform, opacity' }}
        className="absolute w-36 h-36 rounded-full border-2 border-[#22c55e] shadow-[0_0_40px_#22c55e] pointer-events-none"
      />

      {/* 4. Padlock Logo Shield */}
      <div
        ref={logoContainerRef}
        style={{ willChange: 'transform, opacity' }}
        className="relative z-20 flex items-center justify-center drop-shadow-[0_12px_28px_rgba(0,110,47,0.4)]"
      >
        <div className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center relative">
          {isUnlocked ? (
            <img
              src="/LOGO_ALTER.svg"
              alt="SecureLife Padlock Unlocked"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(34,197,94,0.6)]"
            />
          ) : (
            <img
              src="/LOGO.svg"
              alt="SecureLife Padlock Locked"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,110,47,0.5)]"
            />
          )}
        </div>
      </div>

      {/* 5. Minimalist Tech Brand Label */}
      <div
        ref={brandTextRef}
        style={{ willChange: 'transform, opacity' }}
        className="relative z-20 mt-5 flex items-center gap-2 px-3 py-1 rounded-full bg-[#003816]/70 border border-[#22c55e]/30 backdrop-blur-md shadow-lg"
      >
        <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
        <span className="font-title font-bold text-xs tracking-wider text-white uppercase">
          Secure<span className="text-[#22c55e]">Life</span>
        </span>
      </div>
    </div>
  );
};
