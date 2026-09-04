import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface NavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Inicio', href: '#hero' },
  { id: 'servicios', label: 'Servicios', href: '#servicios' },
  { id: 'sobre-nosotros', label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { id: 'cotizador', label: 'Cotizar', href: '#cotizador' },
];

/**
 * Navbar Component
 * 
 * Top responsive navigation bar featuring:
 * - Continuous sliding liquid frame ("marco líquido") across sections from origin to destination without restarts.
 * - Hover changes text color only.
 * - Dual action buttons: Login and Sign Up.
 *
 * @component
 * @layer Layout
 * @module components/layout/Navbar
 * 
 * @param {NavbarProps} props - Component properties.
 * @returns {React.ReactElement} Navigation bar element.
 */
export const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  const navTrackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const isNavClickingRef = useRef<boolean>(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [frameStyle, setFrameStyle] = useState<{
    left: number;
    width: number;
    height: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // Calculate position of the active frame relative to track container
  const updateFramePosition = (sectionId: string) => {
    const activeEl = itemRefs.current[sectionId];
    const trackEl = navTrackRef.current;

    if (activeEl && trackEl) {
      const activeRect = activeEl.getBoundingClientRect();
      const trackRect = trackEl.getBoundingClientRect();

      setFrameStyle({
        left: activeRect.left - trackRect.left,
        width: activeRect.width,
        height: activeRect.height,
        opacity: 1,
      });
    }
  };

  // Update on activeSection change and window resize
  useEffect(() => {
    updateFramePosition(activeSection);

    const handleResize = () => {
      updateFramePosition(activeSection);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection]);

  // Initial measurement after layout mount
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFramePosition('hero');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Monitor scroll position to detect current section in view (ignored during smooth clicks)
  useEffect(() => {
    const handleScroll = () => {
      if (isNavClickingRef.current) return;

      const scrollPosition = window.scrollY + 220;
      const sections = NAV_ITEMS.map((item) => document.querySelector(item.href) as HTMLElement | null);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          if (activeSection !== NAV_ITEMS[i].id) {
            setActiveSection(NAV_ITEMS[i].id);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();

    // Lock scroll listener to prevent it from interrupting the transition midway
    isNavClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    setActiveSection(id);
    updateFramePosition(id);
    setMobileMenuOpen(false);

    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }

    // Release scroll lock once smooth scroll has finished
    clickTimeoutRef.current = setTimeout(() => {
      isNavClickingRef.current = false;
    }, 850);
  };

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-[#f8f9ff]/85 backdrop-blur-xl border-b border-white/50 shadow-sm"
    >
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero', 'hero')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#006e2f] to-[#22c55e] flex items-center justify-center text-white shadow-md shadow-[#22c55e]/25 group-hover:scale-105 transition-transform duration-300 p-2">
            <img src="/LOGO.svg" alt="SecureLife Logo" className="w-5 h-6 object-contain" />
          </div>
          <span className="font-title font-black text-2xl tracking-tight text-[#006e2f]">
            Secure<span className="text-[#0b1c30]">Life</span>
          </span>
        </a>

        {/* Desktop Navigation Links with Sliding Liquid Frame Track */}
        <div
          ref={navTrackRef}
          className="hidden md:flex items-center relative p-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/70 shadow-inner"
        >
          {/* Continuous Sliding Liquid Frame (Marco Líquido de origen a destino continuo) */}
          <span
            style={{
              transform: `translateX(${frameStyle.left}px)`,
              width: `${frameStyle.width}px`,
              height: `${frameStyle.height}px`,
              opacity: frameStyle.opacity,
              willChange: 'transform, width',
            }}
            className="absolute top-1.5 left-0 rounded-full bg-gradient-to-r from-[#22c55e]/15 via-[#10b981]/22 to-[#22c55e]/15 border-1.5 border-[#22c55e]/60 shadow-[0_0_18px_rgba(34,197,94,0.35)] backdrop-blur-sm pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] z-0"
          >
            {/* Liquid Glow Droplet Accent */}
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#22c55e]/70 blur-[1px] animate-pulse" />
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
          </span>

          {/* Links: hover only affects text color */}
          {NAV_ITEMS.map((item) => {
            const isCurrentlyActive = activeSection === item.id;

            return (
              <a
                key={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                className={`relative z-10 px-5 py-2 text-sm font-subtitle font-semibold rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                  isCurrentlyActive
                    ? 'text-[#006e2f] font-bold'
                    : 'text-[#3d4a3d] hover:text-[#006e2f]'
                }`}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Action Buttons: Login + Sign Up */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="glass"
            size="sm"
            onClick={onLoginClick}
            className="font-body border-[#006e2f]/40 hover:border-[#006e2f] text-[#006e2f] shadow-sm px-4 py-2"
          >
            Login
          </Button>

          <Button
            variant="primary"
            size="sm"
            glow
            onClick={onSignUpClick}
            className="font-body bg-[#22c55e] text-[#004b1e] hover:bg-[#16a34a] shadow-md shadow-[#22c55e]/25 font-bold px-4 py-2"
          >
            Sign Up
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-[#006e2f] p-2 hover:bg-[#22c55e]/10 rounded-lg transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 p-6 flex flex-col gap-3 md:hidden shadow-lg animate-slide-up">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.id)}
              className={`font-subtitle font-semibold text-base py-2.5 px-4 rounded-xl transition-all ${
                activeSection === item.id
                  ? 'bg-[#22c55e]/15 text-[#006e2f] font-bold border border-[#22c55e]/30'
                  : 'text-[#0b1c30] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </a>
          ))}

          {/* Mobile Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
            <Button
              variant="glass"
              size="sm"
              onClick={onLoginClick}
              className="flex-1 font-body text-[#006e2f]"
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              glow
              onClick={onSignUpClick}
              className="flex-1 font-body font-bold"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
