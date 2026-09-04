import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  width?: string | number;
  containerClassName?: string;
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
  ...restProps
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ width }} className={`flex flex-col gap-1.5 text-left ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-subtitle text-xs md:text-sm font-semibold text-[#0b1c30] tracking-wide flex items-center justify-between"
        >
          <span>{label}</span>
          {restProps.required && <span className="text-[#22c55e] text-xs font-normal">* Requerido</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full rounded-xl bg-white/80 backdrop-blur-md px-4 py-2.5 text-sm font-body text-[#0b1c30] placeholder:text-gray-400 border transition-all duration-200 outline-none
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200/50 bg-red-50/30'
              : 'border-white/80 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 hover:border-gray-300 shadow-inner'
            }
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
