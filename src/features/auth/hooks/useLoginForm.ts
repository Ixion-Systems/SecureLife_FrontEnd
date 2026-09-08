import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { authStorage } from '../services/authStorage';

/**
 * Custom Hook for Login Form orchestration.
 * Manages form state, validation, and async authentication submission.
 *
 * @hook
 * @layer Presentation / Feature Hook
 * @module features/auth/hooks/useLoginForm
 * 
 * @returns {Object} Structured state and actions for the login form.
 */
export function useLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrDni: '',
      password: '',
      rememberMe: false,
    },
  });

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrDni: data.emailOrDni,
          password: data.password,
          rememberMe: data.rememberMe,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Credenciales inválidas');
      }

      // Persist auth session using sessionStorage (authStorage)
      if (result.data?.tokens?.accessToken) {
        authStorage.setToken(result.data.tokens.accessToken);
      }
      if (result.data?.tokens?.refreshToken) {
        authStorage.setRefreshToken(result.data.tokens.refreshToken);
      }
      if (result.data?.user) {
        authStorage.setUser(result.data.user);
      }

      setSubmitSuccess(true);
      const destination = (location.state as { from?: string } | null)?.from || '/dashboard';
      setTimeout(() => {
        navigate(destination);
      }, 1000);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Error de conexión con el servidor');
    }
  }, [navigate, location.state]);

  return {
    form,
    state: {
      showPassword,
      submitSuccess,
      apiError,
      isSubmitting: form.formState.isSubmitting,
      errors: form.formState.errors,
    },
    actions: {
      toggleShowPassword,
      onSubmit: form.handleSubmit(onSubmit),
    },
  };
}
