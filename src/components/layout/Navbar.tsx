import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useLiquidNavIndicator } from '@/hooks/useLiquidNavIndicator';

export interface NavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'Inicio', href: '#hero' },
  { id: 'servicios', label: 'Servicios', href: '#servicios' },
  { id: 'sobre-nosotros', label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { id: 'cotizador', label: 'Cotizar', href: '#cotizador' },
];

/**
 * Navbar Component
 * 
 * Top responsive navigation bar featuring:
 * - Continuous sliding liquid frame ("marco líquido") across sections powered by useLiquidNavIndicator.
 * - Single-responsibility layout and navigation routing.
 * - Mobile responsive drawer with accessible toggling.
 *
 * @component
 * @layer Layout
 * @module components/layout/Navbar
 * 
 * @param {NavbarProps} props - Component properties.
 * @returns {React.ReactElement} Navigation bar element.
 */
export const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    activeSection,
    frameStyle,
    itemRefs,
    navTrackRef,
    handleNavClick: baseNavClick,
  } = useLiquidNavIndicator(NAV_ITEMS, 'hero');

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/login');
    }
  };

  const handleSignUp = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      navigate('/signup');
    }
  };

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    baseNavClick(href, id);
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
          onClick={(e) => onNavClick(e, '#hero', 'hero')}
          className="flex items-center cursor-pointer group select-none hover:opacity-90 transition-opacity"
        >
          <BrandLogo variant="green" className="h-10" />
        </a>

        {/* Desktop Nav Track with Moving Liquid Frame */}
        <div
          ref={navTrackRef}
          className="hidden md:flex relative items-center bg-[#eaeef7]/80 backdrop-blur-md p-1.5 rounded-full border border-white/70 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]"
        >
          {/* Continuous Sliding Liquid Frame */}
          <span
            className="absolute top-0 left-0 rounded-full pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0
              bg-white shadow-[0_2px_8px_rgba(0,110,47,0.12),0_1px_3px_rgba(0,0,0,0.08)]
              border border-[#22c55e]/40"
            style={{
              transform: `translate3d(${frameStyle.left}px, ${frameStyle.top}px, 0)`,
              width: `${frameStyle.width}px`,
              height: `${frameStyle.height}px`,
              opacity: frameStyle.opacity,
            }}
          >
            {/* Subtle top glare */}
            <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
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
                onClick={(e) => onNavClick(e, item.href, item.id)}
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
            onClick={handleLogin}
            className="font-body border-[#006e2f]/40 hover:border-[#006e2f] text-[#006e2f] shadow-sm px-4 py-2"
          >
            Login
          </Button>

          <Button
            variant="primary"
            size="sm"
            glow
            onClick={handleSignUp}
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
              onClick={(e) => onNavClick(e, item.href, item.id)}
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
              onClick={handleLogin}
              className="flex-1 font-body text-[#006e2f]"
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              glow
              onClick={handleSignUp}
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
