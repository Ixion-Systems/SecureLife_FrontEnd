import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface CoverageCardProps {
  categoryBadge?: string;
  isPopular?: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  onCtaClick?: () => void;
  className?: string;
}

/**
 * CoverageCard Component
 * 
 * Modular card displaying specific insurance branch details,
 * benefits checklist, and an action CTA button.
 *
 * @component
 * @layer Feature Component
 * @module features/landing/components/CoverageCard
 * 
 * @param {CoverageCardProps} props - Component properties.
 * @returns {React.ReactElement} Coverage card element.
 */
export const CoverageCard: React.FC<CoverageCardProps> = ({
  categoryBadge,
  isPopular = false,
  icon,
  title,
  description,
  features,
  ctaText,
  onCtaClick,
  className = '',
}) => {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative overflow-hidden group animate-scale-in ${className}`}
    >
      {/* Popular/Category Badge in Outfit */}
      {categoryBadge && (
        <div
          className={`absolute top-6 right-6 font-subtitle text-xs font-semibold px-3 py-1 rounded-full ${
            isPopular
              ? 'bg-[#22c55e]/20 text-[#006e2f] border border-[#22c55e]/30'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {categoryBadge}
        </div>
      )}

      {/* Icon Container */}
      <div className="w-14 h-14 bg-[#22c55e]/20 text-[#006e2f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#22c55e]/30 transition-all duration-300 shadow-inner">
        {icon}
      </div>

      {/* Title in Google Sans Flex */}
      <h3 className="font-title text-xl font-bold text-[#0b1c30] mb-3">{title}</h3>
      
      {/* Description in Lexend */}
      <p className="font-body text-sm text-gray-600 mb-6 flex-grow leading-relaxed">{description}</p>

      {/* Feature Bullet Points in Lexend */}
      <ul className="mb-8 space-y-3 font-body">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-[#006e2f] shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button in Lexend */}
      <Button
        variant="primary"
        size="md"
        glow
        onClick={onCtaClick}
        className="w-full mt-auto font-body shadow-md shadow-[#22c55e]/20"
      >
        {ctaText}
      </Button>
    </div>
  );
};
