import React from 'react';

export type CardVariant = 'glass-surface' | 'glass-card' | 'white';

export interface CardProps {
  variant?: CardVariant;
  hoverEffect?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}

const CARD_VARIANTS: Record<CardVariant, string> = {
  'glass-surface': 'glass-surface rounded-3xl p-6 md:p-8 border border-white/70 shadow-xl',
  'glass-card': 'glass-card rounded-3xl p-8 border border-white/80 shadow-lg',
  'white': 'bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-sm',
};

/**
 * Card Component
 * 
 * Reusable card supporting glassmorphism surfaces, custom dimensions,
 * and hover lift animations.
 *
 * @component
 * @layer UI Atom
 * @module components/ui/Card
 * 
 * @param {CardProps} props - Component properties.
 * @returns {React.ReactElement} Styled surface card container.
 */
export const Card: React.FC<CardProps> = ({
  variant = 'glass-card',
  hoverEffect = false,
  width,
  height,
  className = '',
  style,
  onClick,
  children,
}) => {
  const hoverClass = hoverEffect ? 'hover:-translate-y-2 hover:shadow-xl transition-all duration-300' : '';

  return (
    <div
      onClick={onClick}
      style={{ width, height, ...style }}
      className={`${CARD_VARIANTS[variant]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
