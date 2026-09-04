import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'glass' | 'white';

export interface BadgeProps {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
  children: React.ReactNode;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  primary: 'bg-[#22c55e]/20 text-[#006e2f] border border-[#22c55e]/30',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200',
  glass: 'bg-white/50 backdrop-blur-md text-[#006e2f] border border-white/60 shadow-sm',
  white: 'bg-white text-[#0b1c30] border border-gray-100 shadow-sm',
};

/**
 * Badge Component
 * 
 * Reusable pill badge with customizable icon, variants, and dimensions.
 *
 * @component
 * @layer UI Atom
 * @module components/ui/Badge
 * 
 * @param {BadgeProps} props - Component properties.
 * @returns {React.ReactElement} Styled badge tag.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  icon,
  width,
  height,
  className = '',
  children,
}) => {
  return (
    <div
      style={{ width, height }}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${BADGE_VARIANTS[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
