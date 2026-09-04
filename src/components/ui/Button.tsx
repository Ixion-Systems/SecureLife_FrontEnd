import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  glow?: boolean;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-[#22c55e] text-[#004b1e] hover:bg-[#4ae176] shadow-lg shadow-[#22c55e]/25 font-semibold',
  secondary: 'bg-[#0b1c30] text-white hover:bg-[#213145] font-semibold',
  glass: 'glass-surface text-[#006e2f] hover:bg-white/70 hover:-translate-y-0.5 border border-white/60 font-semibold',
  outline: 'bg-transparent text-[#006e2f] border border-[#006e2f] hover:bg-[#eff4ff] font-semibold',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs rounded-full',
  md: 'px-6 py-2.5 text-sm rounded-full',
  lg: 'px-8 py-4 text-sm md:text-base rounded-full',
};

/**
 * Button Component
 * 
 * Reusable, customizable button supporting multiple design variants,
 * icons, custom sizing (width/height), and glow effects.
 *
 * @component
 * @layer UI Atom
 * @module components/ui/Button
 * 
 * @param {ButtonProps} props - Component properties.
 * @returns {React.ReactElement} Styled interactive button.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  width,
  height,
  glow = false,
  isLoading = false,
  children,
  className = '',
  style,
  disabled,
  ...restProps
}) => {
  const glowClass = glow ? 'btn-glow' : '';

  return (
    <button
      disabled={disabled || isLoading}
      style={{ width, height, ...style }}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${glowClass} ${className}`}
      {...restProps}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon}
    </button>
  );
};
