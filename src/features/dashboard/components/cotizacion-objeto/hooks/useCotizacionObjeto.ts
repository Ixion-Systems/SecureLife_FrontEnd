import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CotizacionObjetoFormSchema,
  type CotizacionObjetoFormData,
  type InspeccionObjetoArchivo,
  type AsyncCalculoObjetoState,
  type AsyncRadicacionObjetoState,
  type ObjetoWizardStepNumber,
} from '../types/cotizacion-objeto.types';
import {
  calcularCotizacionObjetoApi,
  radicarCotizacionObjetoApi,
} from '../services/cotizacionObjetoApi';

export function useCotizacionObjeto(onSuccessCallback?: () => void) {
  const [currentStep, setCurrentStep] = useState<ObjetoWizardStepNumber>(1);
  const [asyncCalculo, setAsyncCalculo] = useState<AsyncCalculoObjetoState>({
    status: 'idle',
    data: null,
    error: null,
  });
  const [asyncRadicacion, setAsyncRadicacion] = useState<AsyncRadicacionObjetoState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const form = useForm<CotizacionObjetoFormData>({
    resolver: zodResolver(CotizacionObjetoFormSchema),
    mode: 'onChange',
    defaultValues: {
      tipoObjeto: 'SMARTPHONE',
      marca: 'Apple',
      modelo: 'iPhone 15 Pro 256GB',
      numeroSerieOimei: '358941123456789', // 15 dígitos estándar
      valorEstimado: 1_850_000,
      anioCompra: 2024,
      archivos: [],
      cubreRoboExpress: true,
      cubreDanoAccidental: true,
      cubreDerrameLiquidos: true,
      aceptaTerminos: true,
    },
  });

  const {
    register,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  const tipoObjeto = watch('tipoObjeto');
  const valorEstimado = watch('valorEstimado');
  const cubreRobo = watch('cubreRoboExpress');
  const cubreAccidente = watch('cubreDanoAccidental');
  const cubreLiquidos = watch('cubreDerrameLiquidos');
  const archivos = watch('archivos') || [];

  // Recálculo automático en vivo
  const ejecutarCalculo = useCallback(async () => {
    const vals = getValues();
    setAsyncCalculo((prev) => ({ status: 'calculating', data: prev.data, error: null }));
    try {
      const res = await calcularCotizacionObjetoApi(
        vals.tipoObjeto,
        Number(vals.valorEstimado) || 1_200_000,
        vals.cubreRoboExpress,
        vals.cubreDanoAccidental,
        vals.cubreDerrameLiquidos
      );
      setAsyncCalculo({ status: 'success', data: res, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al calcular cotización de tecnología';
      setAsyncCalculo({ status: 'error', data: null, error: msg });
    }
  }, [getValues]);

  useEffect(() => {
    ejecutarCalculo();
  }, [tipoObjeto, valorEstimado, cubreRobo, cubreAccidente, cubreLiquidos, ejecutarCalculo]);

  // Manejadores de Inspección Digital
  const agregarArchivo = (tipo: InspeccionObjetoArchivo['tipo'], file: File) => {
    const nuevo: InspeccionObjetoArchivo = {
      id: `arch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tipo,
      nombreArchivo: file.name,
      tamanoBytes: file.size,
      previewUrl: URL.createObjectURL(file),
      fechaCarga: new Date().toISOString(),
    };
    const filtrados = archivos.filter((a) => a.tipo !== tipo);
    setValue('archivos', [...filtrados, nuevo], { shouldValidate: true });
  };

  const eliminarArchivo = (id: string) => {
    setValue(
      'archivos',
      archivos.filter((a) => a.id !== id),
      { shouldValidate: true }
    );
  };

  // Simulación de carga rápida para testing / demo
  const simularCargaTodos = () => {
    const mockArchivos: InspeccionObjetoArchivo[] = [
      {
        id: `mock-1`,
        tipo: 'FRENTE_PANTALLA',
        nombreArchivo: 'pantalla_imei_marcado.jpg',
        tamanoBytes: 1_250_000,
        previewUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        fechaCarga: new Date().toISOString(),
      },
      {
        id: `mock-2`,
        tipo: 'DORSO_SERIE',
        nombreArchivo: 'dorso_chasis_serie.jpg',
        tamanoBytes: 980_000,
        previewUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
        fechaCarga: new Date().toISOString(),
      },
      {
        id: `mock-3`,
        tipo: 'FACTURA_COMPRA',
        nombreArchivo: 'ticket_factura_oficial.pdf',
        tamanoBytes: 450_000,
        previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        fechaCarga: new Date().toISOString(),
      },
    ];
    setValue('archivos', mockArchivos, { shouldValidate: true });
  };

  const [stepError, setStepError] = useState<string | null>(null);

  // Navegación paso a paso
  const goToNextStep = async () => {
    setStepError(null);

    if (currentStep === 1) {
      const isValid = await trigger(['tipoObjeto']);
      if (!isValid) return;
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const isValid = await trigger([
        'marca',
        'modelo',
        'numeroSerieOimei',
        'valorEstimado',
        'anioCompra',
      ]);
      if (!isValid) return;

      if (tipoObjeto === 'SMARTPHONE') {
        const imeiLimpio = (getValues('numeroSerieOimei') || '').replace(/\D/g, '');
        if (imeiLimpio.length !== 15) {
          setStepError('Para smartphones, el IMEI debe contener exactamente 15 dígitos numéricos (*#06#)');
          return;
        }
      }

      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (archivos.length < 2) {
        setStepError('Debes adjuntar al menos dos (2) fotos o comprobantes para completar la inspección digital');
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
      setCurrentStep((prev) => (prev - 1) as ObjetoWizardStepNumber);
    }
  };

  // Radicación formal
  const radicarCotizacion = async () => {
    const formVals = getValues();
    if (!asyncCalculo.data) {
      await ejecutarCalculo();
    }
    const calcData = asyncCalculo.data;
    if (!calcData) return;

    setAsyncRadicacion({ status: 'submitting', data: null, error: null });
    try {
      const res = await radicarCotizacionObjetoApi(formVals, calcData);
      setAsyncRadicacion({ status: 'success', data: res, error: null });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al radicar cotización de objeto';
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
    register,
    watch,
    setValue,
    errors,
    stepError,
    archivos,
    agregarArchivo,
    eliminarArchivo,
    simularCargaTodos,
    asyncCalculo,
    ejecutarCalculo,
    asyncRadicacion,
    radicarCotizacion,
    resetWizard,
  };
}
