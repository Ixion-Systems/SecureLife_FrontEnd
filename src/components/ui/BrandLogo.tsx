import React from 'react';

export interface BrandLogoProps {
  /**
   * Color variant of the logo:
   * - 'green': Corporate emerald green (#006e2f) for light/white surfaces.
   * - 'white': Crisp white (#ffffff) for dark or green surfaces (sidebar, footer).
   */
  variant?: 'green' | 'white';
  /**
   * Optional CSS classes for additional styling or layout adjustments.
   */
  className?: string;
  /**
   * Optional custom width/height styles or Tailwind size classes.
   */
  width?: number | string;
  height?: number | string;
  /**
   * Accessible alt text for screen readers.
   */
  alt?: string;
}

/**
 * Official SecureLife Logo + Text Component
 * 
 * Renders the official brand emblem and 'SecureLife' wordmark in either
 * corporate emerald green (#006e2f) for light backgrounds or crisp white
 * (#ffffff) for dark/green surfaces.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'green',
  className = '',
  width,
  height,
  alt = 'SecureLife',
}) => {
  const isWhite = variant === 'white';
  const logoSrc = isWhite ? '/LOGO+TEXT.svg' : '/LOGO+TEXT_GREEN.svg';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt={alt}
        width={width}
        height={height}
        className="h-auto max-h-10 w-auto object-contain transition-opacity"
      />
    </div>
  );
};
