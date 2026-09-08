import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ScrollIndicatorProps {
  /** Text to display alongside the animated chevron */
  text?: string;
  /** Optional element ID to scroll to */
  targetId?: string;
  /** Amount in pixels to scroll when clicked (defaults to 400) */
  scrollAmount?: number;
  /** Custom additional class names */
  className?: string;
  /** Whether to automatically hide when user has scrolled past or reached bottom */
  autoHide?: boolean;
  /** Target ref to watch: hides indicator when target's bottom becomes visible in viewport */
  watchRef?: React.RefObject<HTMLElement | null>;
  /** Fixed floating position vs inline */
  position?: 'floating' | 'inline';
}

/**
 * ScrollIndicator Component
 * 
 * Animated scroll cue featuring a downward-pointing chevron with bouncing animation,
 * glassmorphism pill container, and automatic scroll trigger on click.
 * Automatically detects whether content exceeds the visible screen.
 *
 * @component
 * @layer UI Atom
 * @module components/ui/ScrollIndicator
 * 
 * @param {ScrollIndicatorProps} props - Component properties.
 * @returns {React.ReactElement | null} Rendered indicator or null if hidden.
 */
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  text = 'Continuar hacia abajo',
  targetId,
  scrollAmount = 400,
  className = '',
  autoHide = true,
  watchRef,
  position = 'floating',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoHide) return;

    const checkVisibility = () => {
      if (watchRef?.current) {
        const rect = watchRef.current.getBoundingClientRect();
        // Content exceeds screen if its bottom is below the viewport bottom
        const exceedsScreen = rect.bottom > window.innerHeight + 40;
        // Also check if the element has scrolled completely past
        const isAboveFold = rect.top > window.innerHeight;
        setIsVisible(exceedsScreen && !isAboveFold);
      } else {
        const scrollPosition = window.scrollY + window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight;
        setIsVisible(totalHeight - scrollPosition > 120);
      }
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [autoHide, watchRef]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  const positionClasses =
    position === 'floating'
      ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40'
      : 'relative mx-auto';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={text}
      className={`${positionClasses} inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-[#22c55e]/40 shadow-xl shadow-[#0b1c30]/15 hover:shadow-2xl hover:border-[#22c55e] hover:bg-white text-[#0b1c30] transition-all duration-300 group cursor-pointer animate-popover ${className}`}
    >
      <span className="font-subtitle text-xs font-bold tracking-wide text-[#0b1c30] group-hover:text-[#006e2f] transition-colors select-none">
        {text}
      </span>

      <div className="w-5 h-5 rounded-full bg-[#22c55e]/15 flex items-center justify-center text-[#006e2f] group-hover:bg-[#22c55e] group-hover:text-white transition-colors shrink-0">
        <ChevronDown className="w-3.5 h-3.5 animate-bounce stroke-[2.5]" />
      </div>
    </button>
  );
};
