import React from 'react';

export interface PasswordStrengthMeterProps {
  score: number;
  label: string;
  colorClass: string;
  bgClass: string;
  className?: string;
}

/**
 * PasswordStrengthMeter Component
 * 
 * Visual indicator displaying password complexity score (1-4)
 * with animated segment bars and textual feedback.
 *
 * @component
 * @layer Presentation / Feature Subcomponent
 * @module features/auth/components/PasswordStrengthMeter
 * 
 * @param {PasswordStrengthMeterProps} props - Component properties.
 * @returns {React.ReactElement | null} The password strength indicator.
 */
export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  score,
  label,
  colorClass,
  bgClass,
  className = '',
}) => {
  if (score === 0) return null;

  return (
    <div className={`mt-2 space-y-1.5 animate-fadeIn ${className}`}>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-gray-500">Robustez:</span>
        <span className={colorClass}>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= step ? bgClass : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
