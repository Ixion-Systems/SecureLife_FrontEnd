import React from 'react';
import { Button } from '@/components/ui/Button';

export interface SocialAuthButtonsProps {
  mode: 'login' | 'signup';
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
}

/**
 * SocialAuthButtons Component
 * 
 * Provides stacked full-width vector SVG access buttons for Google and Apple,
 * integrated with the project's standard Button atom and hover transitions.
 * Features clean vertical spacing around the divider to prevent collision with form elements.
 *
 * @component
 * @layer Feature Component
 * @module features/auth/components/SocialAuthButtons
 */
export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  mode,
  onGoogleClick,
  onAppleClick,
}) => {
  const dividerLabel = mode === 'login' ? 'O continuar con' : 'O registrarse con';
  const googleText = mode === 'login' ? 'Continuar con Google' : 'Registrarse con Google';
  const appleText = mode === 'login' ? 'Continuar con Apple' : 'Registrarse con Apple';

  return (
    <div className="w-full pt-1">
      {/* Divider with fluid vertical margin */}
      <div className="relative flex items-center justify-center auth-divider-spacing">
        <div className="w-full border-t border-gray-200" />
        <span className="absolute bg-white px-3 sm:px-4 text-xs font-subtitle text-gray-400 uppercase tracking-wider select-none">
          {dividerLabel}
        </span>
      </div>

      {/* Stacked Social Buttons with fluid padding and gap */}
      <div className="auth-social-stack">
        {/* Google Button */}
        <Button
          type="button"
          variant="glass"
          size="md"
          onClick={onGoogleClick}
          leftIcon={
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          }
          className="w-full rounded-full border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-subtitle font-medium shadow-xs py-[clamp(0.45rem,1.1vh,0.65rem)]"
        >
          {googleText}
        </Button>

        {/* Apple Button */}
        <Button
          type="button"
          variant="glass"
          size="md"
          onClick={onAppleClick}
          leftIcon={
            <svg className="w-4 h-4 shrink-0 fill-current text-black" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.7-7.8-12.01-14.26-6.19-9.28-10.88-19.64-14.07-31.06-3.19-11.43-4.78-22.18-4.78-32.26 0-14.88 3.8-27.18 11.4-36.88 7.6-9.7 17.2-14.68 28.78-14.94 4.88.08 10.16 1.25 15.83 3.51 5.67 2.27 9.53 3.44 11.59 3.51 2.27-.13 6.36-1.35 12.27-3.67 5.91-2.31 11.13-3.37 15.66-3.17 12.39.73 22.42 5.34 30.08 13.82-10.82 6.56-16.14 15.54-15.96 26.96.18 8.92 3.63 16.5 10.35 22.75 6.72 6.25 14.83 9.77 24.32 10.56-2.07 6.1-4.7 12.44-7.89 19.04zM119.22 31.84c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 11.96-10.45 19.8-12.17.47 1.21.73 2.53.78 3.96.06 1.43-.09 2.76-.45 3.99-1.28 7.04-4.22 13.52-8.82 19.44-4.6 5.92-10.64 9.87-18.12 11.85-.4-.96-.75-2.07-1.05-3.33-.31-1.26-.48-2.28-.5-3.07z" />
            </svg>
          }
          className="w-full rounded-full border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-subtitle font-medium shadow-xs py-[clamp(0.45rem,1.1vh,0.65rem)]"
        >
          {appleText}
        </Button>
      </div>
    </div>
  );
};
