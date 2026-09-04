import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageIntroLoader } from '@/components/animations/PageIntroLoader';
import { CotizadorModal } from '@/features/cotizador';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutUsSection } from './components/AboutUsSection';
import { CotizadorSection } from './components/CotizadorSection';

/**
 * LandingPage View Component
 * 
 * Main public entry page for SecureLife platform.
 * Orchestrates Navbar, Hero section, dynamic services coverage,
 * animated About Us section, the interactive Auto Insurance Quoting Section (CotizadorSection),
 * footer, and modular GSAP intro loader.
 *
 * @component
 * @layer Presentation / Feature View
 * @module features/landing/LandingPage
 * 
 * @returns {React.ReactElement} The full landing page view.
 */
export const LandingPage: React.FC = () => {
  const [isCotizadorModalOpen, setIsCotizadorModalOpen] = useState(false);

  const handleScrollToCotizador = () => {
    document.getElementById('cotizador')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToServices = () => {
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAbout = () => {
    document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    alert('Acción de Login seleccionada (Módulo de Autenticación)');
  };

  const handleSignUpClick = () => {
    alert('Acción de Registro / Sign Up seleccionada');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* 
        Modular Brand GSAP Intro Animation Loader:
        Can be toggled via the `enabled` prop or by setting ENABLE_PAGE_INTRO in PageIntroLoader.tsx 
      */}
      <PageIntroLoader />

      {/* Top Fixed Navigation with Liquid Animated Frame & Action Buttons */}
      <Navbar
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section with Non-overlapping Asymmetric Floating Cards & Expanded Image */}
        <HeroSection
          onOpenCotizador={handleScrollToCotizador}
          onExplorePlan={handleScrollToCotizador}
          onAdvisorClick={handleScrollToAbout}
        />

        {/* 2. Services Coverage Section with Interactive Sine Wave Canvas */}
        <ServicesSection
          onSelectCoverage={(cat) => {
            if (cat === 'auto') {
              handleScrollToCotizador();
            } else {
              handleScrollToCotizador();
            }
          }}
        />

        {/* 3. About Us Section with Double Vertical Carousel (Up & Down) & Geometry Particle Constellation */}
        <AboutUsSection onExploreCoverage={handleScrollToServices} />

        {/* 4. Cotizador Automotor Section (at the bottom before Footer, with live API calculation & animated canvas) */}
        <CotizadorSection />
      </main>

      {/* Floating Auto Insurance Quoting Modal (Kept for quick modal popups if triggered) */}
      <CotizadorModal
        isOpen={isCotizadorModalOpen}
        onClose={() => setIsCotizadorModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
