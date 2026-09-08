import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { AuthCarousel } from '../components/AuthCarousel';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { useLoginForm } from '../hooks/useLoginForm';
import { LOGIN_SLIDES } from '../slides/loginSlides';

/**
 * LoginPage Component
 * 
 * High-fidelity Solara Split-Screen Login View:
 * - Left column: Clean white surface with brand logo, concise title and subtitle,
 *   styled input fields, remember-me and forgot-password row, solid forest green pill,
 *   and stacked social auth buttons.
 * - Right column: Full-height, deep forest green carousel panel that seamlessly stretches
 *   to 100% viewport height with ambient lighting and support contact.
 *
 * @component
 * @layer Presentation / Feature View
 * @module features/auth/pages/LoginPage
 * 
 * @returns {React.ReactElement} The rendered Login page.
 */
export const LoginPage: React.FC = () => {
  const formContainerRef = useRef<HTMLDivElement>(null);

  const {
    form: { register },
    state: { showPassword, submitSuccess, apiError, isSubmitting, errors },
    actions: { toggleShowPassword, onSubmit },
  } = useLoginForm();

  useEffect(() => {
    const container = formContainerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container.children,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
    }, formContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="auth-viewport-panel w-full flex flex-col lg:flex-row bg-white select-none">
      {/* LEFT COLUMN: Clean White Form Surface (50% desktop, 100% mobile) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between auth-form-panel bg-white overflow-hidden">
        {/* Top bar: Brand Logo on left, Return link on right */}
        <div className="flex items-center justify-between w-full shrink-0 auth-top-bar-margin">
          <Link to="/" className="flex items-center group select-none hover:opacity-90 transition-opacity">
            <BrandLogo variant="green" className="h-9" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-subtitle font-medium text-gray-500 hover:text-[#006e2f] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#006e2f]" />
            <span>Volver al Inicio</span>
          </Link>
        </div>

        {/* Main Login Form Container */}
        <div ref={formContainerRef} className="w-full max-w-md mx-auto my-auto flex flex-col justify-center">
          <div>
            <h1 className="font-title text-3xl sm:text-4xl font-black tracking-tight text-[#0b1c30] mb-1">
              Iniciar Sesión
            </h1>
            <p className="font-body text-xs sm:text-sm text-gray-600 auth-title-margin">
              ¿No tienes una cuenta aún?{' '}
              <Link to="/signup" className="font-semibold text-[#006e2f] hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Submission Success Banner */}
          {submitSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 animate-slide-up">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] shrink-0" />
              <div className="text-xs font-medium">
                ¡Bienvenido de nuevo! Redirigiendo a tu panel...
              </div>
            </div>
          )}

          {/* Submission Error Banner */}
          {apiError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 animate-slide-up">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="text-xs font-medium">{apiError}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form-stack">
            <Input
              id="emailOrDni"
              label="Correo electrónico o DNI"
              placeholder="tu@email.com o 38123456"
              variant="outline"
              error={errors.emailOrDni?.message}
              required
              {...register('emailOrDni')}
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              variant="outline"
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={toggleShowPassword}
                  className="focus:outline-none text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              required
              {...register('password')}
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-gray-300 text-[#004b1e] focus:ring-[#004b1e] accent-[#004b1e]"
                />
                <span className="text-xs font-medium text-gray-600">Recordarme</span>
              </label>

              <a
                href="#recuperar"
                className="text-xs font-medium text-[#006e2f] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              variant="forest"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2 font-title tracking-wide shadow-md rounded-full py-[clamp(0.55rem,1.35vh,0.85rem)] text-sm sm:text-base"
            >
              Iniciar Sesión
            </Button>
          </form>

          <SocialAuthButtons mode="login" />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 py-2 mt-auto shrink-0">
          © {new Date().getFullYear()} SecureLife Seguros S.A. Todos los derechos reservados.
        </div>
      </div>

      {/* RIGHT COLUMN: Full Height Forest Green Carousel Panel */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-[#003816] via-[#004b1e] to-[#082214] self-stretch overflow-hidden">
        <AuthCarousel slides={LOGIN_SLIDES} className="w-full h-full" />
      </div>
    </div>
  );
};
