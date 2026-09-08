import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '../schemas/authSchemas';
import { authStorage } from '../services/authStorage';

export interface PasswordStrength {
  score: number;
  label: string;
  colorClass: string;
  bgClass: string;
}

/**
 * Calculates password strength based on length, casing, numbers, and symbols.
 */
export function calculatePasswordStrength(pass: string): PasswordStrength {
  if (!pass) {
    return { score: 0, label: '', colorClass: 'text-gray-400', bgClass: 'bg-gray-200' };
  }

  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 1) {
    return { score: 1, label: 'Débil', colorClass: 'text-rose-500', bgClass: 'bg-rose-500' };
  }
  if (score === 2) {
    return { score: 2, label: 'Media', colorClass: 'text-amber-500', bgClass: 'bg-amber-500' };
  }
  if (score === 3) {
    return { score: 3, label: 'Fuerte', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500' };
  }
  return { score: 4, label: 'Excelente', colorClass: 'text-[#006e2f]', bgClass: 'bg-[#006e2f]' };
}

/**
 * Custom Hook for Sign Up Form orchestration.
 * Manages form state, validation, password strength scoring, and async submission.
 *
 * @hook
 * @layer Presentation / Feature Hook
 * @module features/auth/hooks/useSignUpForm
 * 
 * @returns {Object} Structured state and actions for the registration form.
 */
export function useSignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      idNumber: '',
      email: '',
      phone: '',
      password: '',
      termsAccepted: false,
    },
  });

  const watchedPassword = useWatch({ control: form.control, name: 'password' });
  const passwordStrength = calculatePasswordStrength(watchedPassword || '');

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(async (data: SignUpFormData) => {
    setApiError(null);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          idNumber: data.idNumber,
          email: data.email,
          phone: data.phone,
          password: data.password,
          termsAccepted: data.termsAccepted,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Error en el registro');
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
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Error de conexión con el servidor');
    }
  }, [navigate]);

  return {
    form,
    state: {
      showPassword,
      submitSuccess,
      apiError,
      passwordStrength,
      isSubmitting: form.formState.isSubmitting,
      errors: form.formState.errors,
    },
    actions: {
      toggleShowPassword,
      onSubmit: form.handleSubmit(onSubmit),
    },
  };
}
