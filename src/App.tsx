import React from 'react';
import { LandingPage } from '@/features/landing/LandingPage';

/**
 * App Root Component
 * 
 * Top-level application component rendering the modular SecureLife Landing Page.
 *
 * @component
 * @layer Application Root
 * @returns {React.ReactElement} Application element.
 */
export const App: React.FC = () => {
  return <LandingPage />;
};

export default App;
