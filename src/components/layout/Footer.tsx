import React from 'react';

/**
 * Footer Component
 * 
 * Standard responsive footer displaying copyright and navigation legal links.
 *
 * @component
 * @layer Layout
 * @module components/layout/Footer
 * 
 * @returns {React.ReactElement} Footer element.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#eff4ff] border-t border-gray-200/60 relative z-20">
      <div className="flex items-center gap-2.5 mb-2 md:mb-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#006e2f] to-[#22c55e] flex items-center justify-center text-white shadow-sm p-1.5">
          <img src="/LOGO.svg" alt="SecureLife Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-title font-black text-2xl text-[#006e2f] tracking-tight">
          Secure<span className="text-[#0b1c30]">Life</span>
        </span>
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
