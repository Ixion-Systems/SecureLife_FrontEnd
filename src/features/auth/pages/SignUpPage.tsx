import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { AuthCarousel } from '../components/AuthCarousel';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { useSignUpForm } from '../hooks/useSignUpForm';
import { SIGNUP_SLIDES } from '../slides/signupSlides';

/**
 * SignUpPage Component
 * 
 * High-fidelity Solara Split-Screen Sign Up View:
 * - Left column: Clean white surface with brand logo, quick registration fields,
 *   password complexity meter, terms agreement, solid forest green pill button,
 *   and stacked social auth buttons.
 * - Right column: Full-height, deep forest green carousel panel highlighting key policyholder perks.
 *
 * @component
 * @layer Presentation / Feature View
 * @module features/auth/pages/SignUpPage
 * 
 * @returns {React.ReactElement} The rendered Sign Up page.
 */
export const SignUpPage: React.FC = () => {
  const formContainerRef = useRef<HTMLDivElement>(null);

  const {
    form: { register },
    state: { showPassword, submitSuccess, apiError, passwordStrength, isSubmitting, errors },
    actions: { toggleShowPassword, onSubmit },
  } = useSignUpForm();

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
          stagger: 0.06,
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

        {/* Main Sign Up Form Container */}
        <div ref={formContainerRef} className="w-full max-w-md lg:max-w-lg mx-auto my-auto flex flex-col justify-center">
          <div>
            <h1 className="font-title text-3xl sm:text-4xl font-black tracking-tight text-[#0b1c30] mb-1">
              Crea tu Cuenta Gratis
            </h1>
            <p className="font-body text-xs sm:text-sm text-gray-600 auth-title-margin">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-semibold text-[#006e2f] hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          {/* Success Banner */}
          {submitSuccess && (
            <div className="mb-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 animate-slide-up">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] shrink-0" />
              <div className="text-xs font-medium">
                ¡Cuenta creada exitosamente! Redirigiendo a tu espacio seguro...
              </div>
            </div>
          )}

          {/* Submission Error Banner */}
          {apiError && (
            <div className="mb-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 animate-slide-up">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="text-xs font-medium">{apiError}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form-stack">
            {/* 2-Column Responsive Field Grid for companion inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-[clamp(0.45rem,1.5vh,0.85rem)]">
              <Input
                id="fullName"
                label="Nombre completo"
                placeholder="Juan Pérez"
                variant="outline"
                error={errors.fullName?.message}
                required
                {...register('fullName')}
              />

              <Input
                id="idNumber"
                label="DNI o CUIL"
                placeholder="38123456 o 20381234568"
                inputMode="numeric"
                variant="outline"
                error={errors.idNumber?.message}
                required
                {...register('idNumber')}
              />

              <Input
                id="email"
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                variant="outline"
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <Input
                id="phone"
                type="tel"
                label="Teléfono celular (+54)"
                placeholder="11 5555 1234"
                variant="outline"
                error={errors.phone?.message}
                required
                {...register('phone')}
              />
            </div>

            <div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número"
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
              <PasswordStrengthMeter {...passwordStrength} className="mt-1" />
            </div>

            {/* Terms and conditions checkbox */}
            <div className="pt-0.5">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('termsAccepted')}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#004b1e] focus:ring-[#004b1e] accent-[#004b1e]"
                />
                <span className="text-xs text-gray-600 leading-tight">
                  Acepto los{' '}
                  <a href="#terminos" className="text-[#006e2f] font-medium hover:underline">
                    Términos de Servicio
                  </a>{' '}
                  y las{' '}
                  <a href="#privacidad" className="text-[#006e2f] font-medium hover:underline">
                    Políticas de Privacidad
                  </a>
                  .
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.termsAccepted.message}</span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="forest"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-1.5 font-title tracking-wide shadow-md rounded-full py-[clamp(0.55rem,1.35vh,0.85rem)] text-sm sm:text-base"
            >
              Crear mi Cuenta Gratis
            </Button>
          </form>

          <SocialAuthButtons mode="signup" />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 py-2 mt-auto shrink-0">
          © {new Date().getFullYear()} SecureLife Seguros S.A. Todos los derechos reservados.
        </div>
      </div>

      {/* RIGHT COLUMN: Full Height Forest Green Carousel Panel */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-[#003816] via-[#004b1e] to-[#082214] self-stretch overflow-hidden">
        <AuthCarousel slides={SIGNUP_SLIDES} className="w-full h-full" />
      </div>
    </div>
  );
};
