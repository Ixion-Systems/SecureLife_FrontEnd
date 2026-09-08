import React from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';

/**
 * Footer Component
 * 
 * Clean, modern footer containing:
 * - Brand logo and corporate identity.
 * - Concise copyright notice.
 * - Legal and navigational links.
 * 
 * @component
 * @layer Presentation / Layout
 * @module components/layout/Footer
 * 
 * @returns {React.ReactElement} Footer element.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#eff4ff] border-t border-gray-200/60 relative z-20">
      <div className="flex items-center mb-2 md:mb-0">
        <BrandLogo variant="green" className="h-9" />
      </div>

      <p className="font-body text-sm text-gray-500 text-center md:text-left order-3 md:order-2 max-w-md">
        © 2026 SecureLife. Unwavering trust, clarity, and modern protection.
      </p>

      <div className="flex flex-wrap justify-center gap-6 order-2 md:order-3 text-xs font-body font-semibold text-gray-600">
        <a href="#" className="hover:text-[#006e2f] hover:underline transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-[#006e2f] hover:underline transition-colors">
          Terms of Service
        </a>
        <a href="#" className="hover:text-[#006e2f] hover:underline transition-colors">
          Security Disclosure
        </a>
        <a href="#" className="hover:text-[#006e2f] hover:underline transition-colors">
          Support
        </a>
      </div>
    </footer>
  );
};
