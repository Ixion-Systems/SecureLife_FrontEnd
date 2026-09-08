import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage, SignUpPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { PageTransition } from '@/components/animations/PageTransition';

import { authStorage } from '@/features/auth/services/authStorage';

/**
 * ProtectedRoute Component
 *
 * Enforces session authentication via authStorage (sessionStorage).
 * Redirects unauthenticated users to the Login view without exposing protected endpoints.
 */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

/**
 * AnimatedAppRoutes Component
 * 
 * Sub-router that provides continuous animated transitions between routes
 * with GSAP GPU acceleration and energy sweep beam.
 */
const AnimatedAppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
};

/**
 * App Root Component
 * 
 * Top-level application component configuring client-side routing
 * with React Router DOM and GSAP cinematic transitions.
 *
 * @component
 * @layer Application Root
 * @returns {React.ReactElement} Application router element.
 */
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AnimatedAppRoutes />
    </BrowserRouter>
  );
};

export default App;
