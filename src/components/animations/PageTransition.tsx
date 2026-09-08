import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition Component
 * 
 * Orchestrates tailored, cinematic GSAP transitions based on route context (Option 4 - Liquid Morph Portal):
 * 1. Initial Site Load / Direct URL at '/':
 *    - Padlock emergence (LOGO.svg), tactile unlock to LOGO_ALTER.svg.
 *    - Circular emerald shockwave ring bursting outward.
 *    - Smooth dissolve into landing page.
 * 
 * 2. Landing -> Auth ('/' -> '/login' or '/signup'):
 *    - Liquid Morph Portal: An organic circular emerald wave blossoms outward from the navbar position.
 *    - Opens up and smoothly reveals the split-screen authentication view.
 * 
 * 3. Inter-Auth Navigation ('/login' <-> '/signup'):
 *    - Smooth horizontal slide push in the direction of navigation with micro-scale & opacity.
 *    - Fluid emerald streak beam sweeping across the top.
 * 
 * 4. Auth -> Landing ('/login' or '/signup' -> '/'):
 *    - Liquid Morph Portal returns smoothly into the full landing page view.
 *
 * @component
 * @layer Presentation / Animation Wrapper
 * @module components/animations/PageTransition
 * 
 * @param {PageTransitionProps} props - Component properties.
 * @returns {React.ReactElement} Animated route container with specialized transitions.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Tracks the last interaction point (click / touch / keydown)
  const lastInteractionRef = useRef<{ x: number; y: number; time: number }>({
    x: typeof window !== 'undefined' ? Math.round(window.innerWidth / 2) : 500,
    y: typeof window !== 'undefined' ? Math.round(window.innerHeight / 2) : 300,
    time: 0,
  });

  // State tracker resilient to React StrictMode double mounts
  const lastKeyRef = useRef<string | null>(null);
  const activeNavRef = useRef<{ from: string | null; to: string; key: string }>({
    from: null,
    to: location.pathname,
    key: location.key,
  });

  // 1. Landing Intro Refs (Padlock + Expanding Shockwave)
  const landingOverlayRef = useRef<HTMLDivElement>(null);
  const landingLogoRef = useRef<HTMLDivElement>(null);
  const closedLogoRef = useRef<HTMLImageElement>(null);
  const openLogoRef = useRef<HTMLImageElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);

  // 2. Liquid Morph Portal Refs (Option 4 - Dynamic Click Origin)
  const liquidPortalRef = useRef<HTMLDivElement>(null);
  const portalShockwaveRef = useRef<HTMLDivElement>(null);
  const portalGlowRef = useRef<HTMLDivElement>(null);

  // Global listener for pointer/touch/keyboard coordinates
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent | MouseEvent | TouchEvent) => {
      let clientX: number | undefined;
      let clientY: number | undefined;

      if ('touches' in e && e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      if (typeof clientX === 'number' && typeof clientY === 'number') {
        lastInteractionRef.current = {
          x: Math.round(clientX),
          y: Math.round(clientY),
          time: Date.now(),
        };
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const activeEl = document.activeElement;
        if (activeEl && activeEl !== document.body) {
          const rect = activeEl.getBoundingClientRect();
          lastInteractionRef.current = {
            x: Math.round(rect.left + rect.width / 2),
            y: Math.round(rect.top + rect.height / 2),
            time: Date.now(),
          };
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true });
    window.addEventListener('click', handlePointerDown, { capture: true, passive: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      window.removeEventListener('click', handlePointerDown, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentKey = location.key;

    // Detect if this is a new navigation event (StrictMode sends same key on double mount)
    if (lastKeyRef.current !== currentKey) {
      activeNavRef.current = {
        from: activeNavRef.current.to !== currentPath ? activeNavRef.current.to : activeNavRef.current.from,
        to: currentPath,
        key: currentKey,
      };
      lastKeyRef.current = currentKey;
    }

    const { from, to } = activeNavRef.current;
    const isInitialLandingLoad = to === '/' && (from === null || from === '/');
    const isRouteTransition = from !== null && from !== to;

    const landingOverlay = landingOverlayRef.current;
    const liquidPortal = liquidPortalRef.current;
    const portalShockwave = portalShockwaveRef.current;
    const portalGlow = portalGlowRef.current;
    const content = contentWrapperRef.current;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (landingOverlay) landingOverlay.style.display = 'none';
      if (liquidPortal) liquidPortal.style.display = 'none';
      return;
    }

    const ctx = gsap.context(() => {
      // CASE 1: LANDING PAGE INITIAL LOAD / RELOAD AT '/'
      // Padlock emergence, tactile unlock to LOGO_ALTER.svg and circular shockwave burst
      if (isInitialLandingLoad && !isRouteTransition) {
        if (liquidPortal) liquidPortal.style.display = 'none';
        if (!landingOverlay || !landingLogoRef.current) return;

        landingOverlay.style.display = 'flex';

        const tl = gsap.timeline({
          onComplete: () => {
            landingOverlay.style.display = 'none';
          },
        });

        gsap.set(landingOverlay, { opacity: 1 });
        gsap.set(landingLogoRef.current, { opacity: 0, scale: 0.65, y: 12 });
        gsap.set(closedLogoRef.current, { opacity: 1 });
        gsap.set(openLogoRef.current, { opacity: 0 });
        gsap.set(shockwaveRef.current, { scale: 0.5, opacity: 0 });

        // 1. Logo emergence (0.24s)
        tl.to(landingLogoRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.24,
          ease: 'back.out(1.7)',
        })
        // 2. Micro-press anticipation (0.07s)
        .to(landingLogoRef.current, {
          scale: 0.93,
          y: 2,
          duration: 0.07,
          ease: 'power1.in',
        })
        // 3. Tactile unlock to LOGO_ALTER.svg (0.18s)
        .to(landingLogoRef.current, {
          scale: 1.14,
          y: -4,
          duration: 0.18,
          ease: 'back.out(2.2)',
        })
        .to(closedLogoRef.current, { opacity: 0, duration: 0.04 }, '<')
        .to(openLogoRef.current, { opacity: 1, duration: 0.04 }, '<')
        // 4. Expanding circular shockwave ring burst
        .fromTo(
          shockwaveRef.current,
          { scale: 0.6, opacity: 0.95 },
          {
            scale: 3.6,
            opacity: 0,
            duration: 0.42,
            ease: 'power2.out',
          },
          '<'
        )
        // 5. Logo settles peacefully (0.12s)
        .to(landingLogoRef.current, {
          scale: 1,
          y: 0,
          duration: 0.12,
          ease: 'power2.out',
        })
        // 6. Brief hold (0.08s)
        .to({}, { duration: 0.08 })
        // 7. Smooth dissolve (0.20s)
        .to(landingLogoRef.current, {
          opacity: 0,
          scale: 1.08,
          y: -6,
          duration: 0.20,
          ease: 'power2.in',
        })
        .to(
          landingOverlay,
          {
            opacity: 0,
            duration: 0.24,
            ease: 'power2.inOut',
          },
          '-=0.12'
        );
        return;
      }

      // CASE 2: DYNAMIC LIQUID MORPH PORTAL FROM CLICK COORDINATES
      // Triggers on:
      // - Landing -> Login or SignUp ('/' -> '/login' | '/signup')
      // - Login <-> SignUp ('/login' <-> '/signup')
      // - Auth -> Landing ('/login' | '/signup' -> '/')
      if (isRouteTransition) {
        if (landingOverlay) landingOverlay.style.display = 'none';
        if (!liquidPortal || !content) return;

        // Resolve origin coordinates from click, touch, or active element
        const isRecent = Date.now() - lastInteractionRef.current.time < 2000;
        const originX = isRecent
          ? lastInteractionRef.current.x
          : Math.round(window.innerWidth / 2);
        const originY = isRecent
          ? lastInteractionRef.current.y
          : Math.round(window.innerHeight / 2);

        // Maximum distance to the farthest viewport corner to cover the entire screen
        const maxDistX = Math.max(originX, window.innerWidth - originX);
        const maxDistY = Math.max(originY, window.innerHeight - originY);
        const maxRadius = Math.ceil(Math.hypot(maxDistX, maxDistY) * 1.05);

        liquidPortal.style.display = 'block';

        const tl = gsap.timeline({
          onComplete: () => {
            liquidPortal.style.display = 'none';
          },
        });

        // Set initial state centered precisely on click coordinates
        gsap.set(liquidPortal, {
          opacity: 1,
          clipPath: `circle(0px at ${originX}px ${originY}px)`,
        });

        if (portalShockwave) {
          gsap.set(portalShockwave, {
            left: originX,
            top: originY,
            xPercent: -50,
            yPercent: -50,
            width: 40,
            height: 40,
            scale: 0.1,
            opacity: 0.95,
          });
        }

        if (portalGlow) {
          gsap.set(portalGlow, {
            left: originX,
            top: originY,
            xPercent: -50,
            yPercent: -50,
            width: 260,
            height: 260,
            scale: 0.2,
            opacity: 0.8,
          });
        }

        // 1. Blossom liquid emerald wave outward from click coordinates (0.44s)
        tl.to(liquidPortal, {
          clipPath: `circle(${maxRadius}px at ${originX}px ${originY}px)`,
          duration: 0.44,
          ease: 'power2.inOut',
        });

        if (portalShockwave) {
          tl.to(
            portalShockwave,
            {
              scale: Math.ceil(maxRadius / 20),
              opacity: 0,
              duration: 0.44,
              ease: 'power2.out',
            },
            0
          );
        }

        if (portalGlow) {
          tl.to(
            portalGlow,
            {
              scale: 2.8,
              opacity: 0,
              duration: 0.48,
              ease: 'power2.out',
            },
            0
          );
        }

        // 2. Incoming content settles gently into place
        tl.fromTo(
          content,
          {
            y: 12,
            scale: 0.99,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.36,
            ease: 'power3.out',
            clearProps: 'transform,scale,y,opacity',
          },
          '-=0.18'
        )
        // 3. Liquid portal veil dissolves smoothly
        .to(
          liquidPortal,
          {
            opacity: 0,
            duration: 0.26,
            ease: 'power2.out',
          },
          '-=0.18'
        );
        return;
      }

      // Initial mount on non-landing routes (e.g. direct URL to /login)
      if (landingOverlay) landingOverlay.style.display = 'none';
      if (liquidPortal) liquidPortal.style.display = 'none';
    }, containerRef);

    return () => {
      ctx.revert();
      if (landingOverlay) landingOverlay.style.display = 'none';
      if (liquidPortal) liquidPortal.style.display = 'none';
    };
  }, [location.pathname, location.key]);

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        isAuthRoute ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'
      } bg-white`}
    >
      {/* 1. OVERLAY DE LANDING: Candado con Desbloqueo Táctil + Onda Expansiva Circular (Carga inicial) */}
      <div
        ref={landingOverlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#007934] via-[#005e27] to-[#004419] pointer-events-auto select-none"
        style={{ display: 'none' }}
      >
        {/* Halo de luz esmeralda suave */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#22c55e]/25 blur-3xl pointer-events-none" />

        {/* Anillo de Onda Expansiva Circular Concéntrica */}
        <div
          ref={shockwaveRef}
          style={{ willChange: 'transform, opacity' }}
          className="absolute w-36 h-36 rounded-full border-2 border-[#22c55e] shadow-[0_0_45px_#22c55e] pointer-events-none opacity-0"
        />

        {/* Logotipo del Candado */}
        <div
          ref={landingLogoRef}
          style={{ willChange: 'transform, opacity' }}
          className="relative z-10 flex items-center justify-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
        >
          <div className="w-16 h-20 sm:w-20 sm:h-24 relative flex items-center justify-center">
            <img
              ref={closedLogoRef}
              src="/LOGO.svg"
              alt="SecureLife Locked Logo"
              className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)]"
            />
            <img
              ref={openLogoRef}
              src="/LOGO_ALTER.svg"
              alt="SecureLife Unlocked Logo"
              className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)] opacity-0"
            />
          </div>
        </div>
      </div>

      {/* 2. OVERLAY LIQUID MORPH PORTAL (Opción 4: Se expande desde el punto exacto del click) */}
      <div
        ref={liquidPortalRef}
        aria-hidden="true"
        className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#007934] via-[#005e27] to-[#004419] pointer-events-auto select-none opacity-0"
        style={{ display: 'none', willChange: 'clip-path, opacity' }}
      >
        {/* Onda expansiva concéntrica emanando del cursor */}
        <div
          ref={portalShockwaveRef}
          style={{ willChange: 'transform, opacity' }}
          className="absolute rounded-full border-2 border-[#4ade80] shadow-[0_0_45px_#22c55e] pointer-events-none opacity-0"
        />

        {/* Halo de luz ambiental centrado en el punto del cursor */}
        <div
          ref={portalGlowRef}
          style={{ willChange: 'transform, opacity' }}
          className="absolute rounded-full bg-[#22c55e]/35 blur-3xl pointer-events-none opacity-0"
        />
      </div>

      {/* Main Page Route Content */}
      <div
        ref={contentWrapperRef}
        className={`w-full ${isAuthRoute ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}
      >
        {children}
      </div>
    </div>
  );
};
