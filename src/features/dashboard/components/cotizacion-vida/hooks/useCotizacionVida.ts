import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CotizacionVidaFormSchema,
  type CotizacionVidaFormData,
  type Beneficiario,
  type AsyncCalculoVidaState,
  type AsyncRadicacionVidaState,
  type VidaWizardStepNumber,
} from '../types/cotizacion-vida.types';
import {
  calcularCotizacionVidaApi,
  radicarCotizacionVidaApi,
} from '../services/cotizacionVidaApi';

export function useCotizacionVida(onSuccessCallback?: () => void) {
  const [currentStep, setCurrentStep] = useState<VidaWizardStepNumber>(1);
  const [asyncCalculo, setAsyncCalculo] = useState<AsyncCalculoVidaState>({
    status: 'idle',
    data: null,
    error: null,
  });
  const [asyncRadicacion, setAsyncRadicacion] = useState<AsyncRadicacionVidaState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const form = useForm<CotizacionVidaFormData>({
    resolver: zodResolver(CotizacionVidaFormSchema),
    mode: 'onChange',
    defaultValues: {
      fechaNacimiento: '1990-05-15',
      edad: 35,
      genero: 'MASCULINO',
      ocupacion: 'Ingeniero de Software',
      categoriaRiesgo: 'ADMINISTRATIVO',
      esFumador: false,
      cigarrillosPorDia: 0,
      practicaDeportesRiesgo: false,
      deportesDeclarados: [],
      tieneEnfermedadesPreexistentes: false,
      enfermedadesDeclaradas: [],
      observacionesSalud: '',
      capitalAsegurado: 25_000_000,
      beneficiarios: [
        {
          id: 'b-1',
          nombreCompleto: 'María González',
          dni: '38123456',
          parentesco: 'CONYUGE',
          porcentaje: 60,
        },
        {
          id: 'b-2',
          nombreCompleto: 'Lucas González',
          dni: '48987654',
          parentesco: 'HIJO',
          porcentaje: 40,
        },
      ],
      aceptaTerminos: true,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'beneficiarios',
  });

  const watchedCapital = watch('capitalAsegurado');
  const watchedBeneficiarios = watch('beneficiarios');
  const watchedEdad = watch('edad');
  const watchedCategoria = watch('categoriaRiesgo');
  const watchedFumador = watch('esFumador');
  const watchedDeportes = watch('practicaDeportesRiesgo');
  const watchedPreexistencias = watch('tieneEnfermedadesPreexistentes');

  // Suma en vivo de porcentajes de beneficiarios
  const sumaPorcentajes = useMemo(() => {
    if (!watchedBeneficiarios || !Array.isArray(watchedBeneficiarios)) return 0;
    return watchedBeneficiarios.reduce((sum, b) => sum + (Number(b.porcentaje) || 0), 0);
  }, [watchedBeneficiarios]);

  const esPorcentajeExacto = Math.round(sumaPorcentajes) === 100;

  // Recálculo automático de la cotización
  const ejecutarCalculo = useCallback(async () => {
    const vals = getValues();
    setAsyncCalculo((prev) => ({ status: 'calculating', data: prev.data, error: null }));
    try {
      const res = await calcularCotizacionVidaApi(
        {
          edad: vals.edad,
          fechaNacimiento: vals.fechaNacimiento,
          genero: vals.genero,
          ocupacion: vals.ocupacion,
          categoriaRiesgo: vals.categoriaRiesgo,
        },
        {
          esFumador: vals.esFumador,
          cigarrillosPorDia: vals.cigarrillosPorDia,
          practicaDeportesRiesgo: vals.practicaDeportesRiesgo,
          deportesDeclarados: vals.deportesDeclarados,
          tieneEnfermedadesPreexistentes: vals.tieneEnfermedadesPreexistentes,
          enfermedadesDeclaradas: vals.enfermedadesDeclaradas,
        },
        Number(vals.capitalAsegurado) || 25_000_000
      );
      setAsyncCalculo({ status: 'success', data: res, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cotizar seguro de vida';
      setAsyncCalculo({ status: 'error', data: null, error: msg });
    }
  }, [getValues]);

  // Disparar recálculo cuando cambian variables sensibles o al montar
  useEffect(() => {
    ejecutarCalculo();
  }, [
    watchedCapital,
    watchedEdad,
    watchedCategoria,
    watchedFumador,
    watchedDeportes,
    watchedPreexistencias,
    ejecutarCalculo,
  ]);

  // Manejador de agregar beneficiario
  const agregarBeneficiario = () => {
    const restante = Math.max(0, 100 - sumaPorcentajes);
    const nuevo: Beneficiario = {
      id: `b-${Date.now()}`,
      nombreCompleto: '',
      dni: '',
      parentesco: 'OTRO',
      porcentaje: restante > 0 ? restante : 10,
    };
    append(nuevo);
  };

  // Validaciones y navegación paso a paso
  const [stepError, setStepError] = useState<string | null>(null);

  const goToNextStep = async () => {
    setStepError(null);

    if (currentStep === 1) {
      const isValid = await trigger(['fechaNacimiento', 'edad', 'genero', 'ocupacion', 'categoriaRiesgo']);
      if (!isValid) return;
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const isValid = await trigger(['esFumador', 'practicaDeportesRiesgo', 'tieneEnfermedadesPreexistentes']);
      if (!isValid) return;
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      const isValid = await trigger(['capitalAsegurado', 'beneficiarios']);
      if (!isValid) return;

      if (!esPorcentajeExacto) {
        setStepError(
          `La suma de los porcentajes asignados es ${sumaPorcentajes}%. Debe ser exactamente 100% para continuar.`
        );
        return;
      }

      await ejecutarCalculo();
      setCurrentStep(4);
      return;
    }
  };

  const goToPreviousStep = () => {
    setStepError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as VidaWizardStepNumber);
    }
  };

  // Radicación formal final
  const radicarCotizacion = async () => {
    const formVals = getValues();
    if (!asyncCalculo.data) {
      await ejecutarCalculo();
    }
    const calcData = asyncCalculo.data;
    if (!calcData) return;

    setAsyncRadicacion({ status: 'submitting', data: null, error: null });
    try {
      const res = await radicarCotizacionVidaApi(formVals, calcData);
      setAsyncRadicacion({ status: 'success', data: res, error: null });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo radicar la cotización de vida';
      setAsyncRadicacion({ status: 'error', data: null, error: msg });
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    form.reset();
    setAsyncRadicacion({ status: 'idle', data: null, error: null });
    ejecutarCalculo();
  };

  return {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    form,
    control,
    register,
    watch,
    setValue,
    errors,
    stepError,
    fields,
    append,
    remove,
    agregarBeneficiario,
    sumaPorcentajes,
    esPorcentajeExacto,
    asyncCalculo,
    ejecutarCalculo,
    asyncRadicacion,
    radicarCotizacion,
    resetWizard,
    handleSubmit,
  };
}
