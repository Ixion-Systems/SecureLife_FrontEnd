import { useState, useEffect, useRef, useCallback } from 'react';

export interface NavItemDef {
  id: string;
  href: string;
}

export interface FrameGeometry {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
}

/**
 * useLiquidNavIndicator Hook
 * 
 * Computes fluid pill coordinates and handles smooth navigation transitions
 * between sections without synchronous DOM queries on every scroll tick.
 *
 * @hook
 * @layer Core Hooks
 * @module hooks/useLiquidNavIndicator
 * 
 * @param {NavItemDef[]} items - Navigation items definition.
 * @param {string} [defaultActive='hero'] - Default active section ID.
 * @returns {Object} Frame geometry, active section ID, element refs, and navigation handlers.
 */
export function useLiquidNavIndicator(
  items: NavItemDef[],
  defaultActive = 'hero'
) {
  const [activeSection, setActiveSection] = useState<string>(defaultActive);
  const [frameStyle, setFrameStyle] = useState<FrameGeometry>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navTrackRef = useRef<HTMLDivElement | null>(null);
  const isNavClickingRef = useRef(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update pill position relative to the track container
  const updateFramePosition = useCallback((sectionId: string) => {
    const activeEl = itemRefs.current[sectionId];
    const trackEl = navTrackRef.current;

    if (activeEl && trackEl) {
      const activeRect = activeEl.getBoundingClientRect();
      const trackRect = trackEl.getBoundingClientRect();

      setFrameStyle({
        left: Math.round(activeRect.left - trackRect.left),
        top: Math.round(activeRect.top - trackRect.top),
        width: Math.round(activeRect.width),
        height: Math.round(activeRect.height),
        opacity: 1,
      });
    }
  }, []);

  // Update on section change and window resize
  useEffect(() => {
    updateFramePosition(activeSection);

    const handleResize = () => {
      updateFramePosition(activeSection);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection, updateFramePosition]);

  // Initial measurement after layout mount
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFramePosition(defaultActive);
    }, 120);
    return () => clearTimeout(timer);
  }, [defaultActive, updateFramePosition]);

  // Scroll spy using passive requestAnimationFrame to avoid frame drops
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isNavClickingRef.current || ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + 220;

        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];
          const section = document.getElementById(item.id) || document.querySelector(item.href) as HTMLElement | null;
          if (section && section.offsetTop <= scrollPosition) {
            if (activeSection !== item.id) {
              setActiveSection(item.id);
            }
            break;
          }
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [items, activeSection]);

  const handleNavClick = useCallback((href: string, id: string) => {
    isNavClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    setActiveSection(id);
    updateFramePosition(id);

    if (href === '#hero' || id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetId = href.replace(/^#/, '');
      const element = document.getElementById(targetId) || document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }

    clickTimeoutRef.current = setTimeout(() => {
      isNavClickingRef.current = false;
    }, 850);
  }, [updateFramePosition]);

  return {
    activeSection,
    frameStyle,
    itemRefs,
    navTrackRef,
    handleNavClick,
    updateFramePosition,
  };
}
