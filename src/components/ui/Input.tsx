import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  width?: string | number;
  containerClassName?: string;
  variant?: 'glass' | 'outline';
  inputSize?: 'sm' | 'md';
}

/**
 * Input Component
 * 
 * Reusable form input supporting floating labels, inline error messages,
 * prefix/suffix icons, and glassmorphism styling consistent with SecureLife brand.
 *
 * @component
 * @layer UI Atom
 * @module components/ui/Input
 * 
 * @param {InputProps} props - Component properties.
 * @returns {React.ReactElement} Styled input field with optional label and error.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  width,
  className = '',
  containerClassName = '',
  disabled,
  id,
  variant = 'glass',
  inputSize = 'md',
  ...restProps
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const variantStyles = variant === 'outline'
    ? (error
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200/50 bg-red-50/20'
        : 'border-gray-200 focus:border-[#006e2f] focus:ring-2 focus:ring-[#006e2f]/15 hover:border-gray-300 bg-white shadow-xs')
    : (error
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200/50 bg-red-50/30'
        : 'border-white/80 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 hover:border-gray-300 bg-white/80 backdrop-blur-md shadow-inner');

  const sizeStyles = inputSize === 'sm'
    ? 'px-3.5 py-2 text-xs sm:text-sm rounded-xl'
    : 'px-4 py-2.5 text-sm rounded-xl';

  return (
    <div style={{ width }} className={`flex flex-col ${inputSize === 'sm' ? 'gap-1' : 'gap-1.5'} text-left ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`font-subtitle font-semibold text-[#0b1c30] tracking-wide flex items-center justify-between ${
            inputSize === 'sm' ? 'text-xs' : 'text-xs md:text-sm'
          }`}
        >
          <span>{label}</span>
          {restProps.required && <span className="text-[#22c55e] text-[11px] font-normal">* Requerido</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full font-body text-[#0b1c30] placeholder:text-gray-400 border transition-all duration-200 outline-none
            ${leftIcon ? 'pl-9' : ''}
            ${rightIcon ? 'pr-9' : ''}
            ${sizeStyles}
            ${variantStyles}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
            ${className}`}
          {...restProps}
        />

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-red-500 mt-0.5 animate-slide-up flex items-center gap-1">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-gray-500 mt-0.5 font-normal">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
