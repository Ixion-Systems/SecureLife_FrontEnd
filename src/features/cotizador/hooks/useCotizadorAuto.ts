import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CotizacionAutoSchema,
  type CotizacionAutoFormData,
  type AsyncCotizacionState,
  type WizardStepNumber,
  type ResultadoCotizacion,
} from '../types/cotizacion-auto.types';
import { calcularCotizacionLocal } from '../utils/calculoCotizacion';

const INITIAL_FORM_VALUES: CotizacionAutoFormData = {
  titular: {
    nombreCompleto: '',
    dni: '',
    email: '',
    telefono: '',
  },
  vehiculo: {
    patente: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    tieneGnc: false,
    kilometrajePromedioAnual: 15000,
  },
  coberturaSolicitada: 'TERCEROS_COMPLETO',
  conductoresAdicionales: [],
};

const API_ENDPOINT = 'http://localhost:3000/api/v1/cotizaciones/auto';

/**
 * Custom Hook: useCotizadorAuto
 *
 * Encapsulates the complete business logic, step navigation, validation,
 * and asynchronous calculation state for the Auto Insurance Quoting Wizard.
 * Adheres to React Clean Architecture and TypeScript Clean Standards.
 *
 * @hook
 * @layer Domain / Custom Hook
 * @module features/cotizador/hooks/useCotizadorAuto
 *
 * @returns {object} Form methods, step state, calculation state, and action dispatchers.
 */
export function useCotizadorAuto() {
  const [currentStep, setCurrentStep] = useState<WizardStepNumber>(1);
  const [asyncState, setAsyncState] = useState<AsyncCotizacionState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const form = useForm<CotizacionAutoFormData>({
    resolver: zodResolver(CotizacionAutoSchema),
    defaultValues: INITIAL_FORM_VALUES,
    mode: 'onTouched',
  });

  const { fields: conductoresFields, append: appendConductor, remove: removeConductor } = useFieldArray({
    control: form.control,
    name: 'conductoresAdicionales',
  });

  /**
   * Performs the quote calculation.
   * Tries to call the backend REST API; if unavailable or error occurs,
   * falls back gracefully and deterministically to the local calculation engine.
   */
  const calcularCotizacion = useCallback(async (formData: CotizacionAutoFormData) => {
    setAsyncState({ status: 'loading', data: null, error: null });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const raw = json.data || json;
        const quoteResult: ResultadoCotizacion = {
          id: raw.id || raw.cotizacionId || `COT-${Date.now()}`,
          cobertura: raw.cobertura || formData.coberturaSolicitada,
          primaMensualEstimada: raw.primaMensualEstimada ?? raw.primaMensual ?? 0,
          sumaAsegurada: raw.sumaAsegurada ?? 0,
          franquicia:
            raw.franquicia !== undefined
              ? raw.franquicia
              : raw.franquiciaMonto && raw.franquiciaMonto > 0
              ? raw.franquiciaMonto
              : null,
          desglose: {
            premioBase: raw.desglose?.premioBase ?? raw.detalleCalculo?.base ?? 0,
            recargoGnc: raw.desglose?.recargoGnc ?? raw.detalleCalculo?.recargoGnc ?? 0,
            ajusteKilometraje:
              raw.desglose?.ajusteKilometraje ??
              (raw.detalleCalculo?.bonificacion ? -raw.detalleCalculo.bonificacion : 0),
            recargoConductores: raw.desglose?.recargoConductores ?? 0,
            impuestos: raw.desglose?.impuestos ?? raw.detalleCalculo?.impuestos ?? 0,
          },
          fechaCalculo: raw.fechaCalculo || new Date().toISOString(),
          origen: 'api',
        };
        setAsyncState({ status: 'success', data: quoteResult, error: null });
        return;
      }
      
      // Fallback local if backend responded with non-200
      const localResult = calcularCotizacionLocal(formData, 'fallback_local');
      setAsyncState({ status: 'success', data: localResult, error: null });
    } catch {
      // Backend not running (e.g. ECONNREFUSED) or request aborted: Fallback local engine
      const localResult = calcularCotizacionLocal(formData, 'fallback_local');
      setAsyncState({ status: 'success', data: localResult, error: null });
    }
  }, []);

  /**
   * Advances to next step with step-specific validation trigger.
   */
  const goToNextStep = useCallback(async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger([
        'titular.nombreCompleto',
        'titular.dni',
        'titular.email',
        'titular.telefono',
      ]);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      isValid = await form.trigger([
        'vehiculo.patente',
        'vehiculo.marca',
        'vehiculo.modelo',
        'vehiculo.anio',
        'vehiculo.kilometrajePromedioAnual',
      ]);
      if (isValid) setCurrentStep(3);
    } else if (currentStep === 3) {
      isValid = await form.trigger(['coberturaSolicitada', 'conductoresAdicionales']);
      if (isValid) {
        setCurrentStep(4);
        const data = form.getValues();
        await calcularCotizacion(data);
      }
    }
  }, [currentStep, form, calcularCotizacion]);

  /**
   * Moves back to previous step
   */
  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => {
      const nextStep = Math.max(1, prev - 1) as WizardStepNumber;
      return nextStep;
    });
  }, []);

  /**
   * Jump directly to a step if previously validated
   */
  const goToStep = useCallback((step: WizardStepNumber) => {
    setCurrentStep(step);
  }, []);

  /**
   * Reset the whole wizard back to step 1
   */
  const resetWizard = useCallback(() => {
    form.reset(INITIAL_FORM_VALUES);
    setCurrentStep(1);
    setAsyncState({ status: 'idle', data: null, error: null });
  }, [form]);

  /**
   * Add a new blank additional driver
   */
  const handleAddConductor = useCallback(() => {
    appendConductor({
      nombreCompleto: '',
      parentesco: '',
      edad: 25,
    });
  }, [appendConductor]);

  return {
    // Step State
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetWizard,

    // Form Hook API
    form,
    register: form.register,
    control: form.control,
    watch: form.watch,
    setValue: form.setValue,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,

    // Dynamic Drivers
    conductoresFields,
    addConductor: handleAddConductor,
    removeConductor,

    // Async Calculation
    asyncState,
    recalcular: () => calcularCotizacion(form.getValues()),
  };
}
