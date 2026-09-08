import { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CotizacionInmuebleFormSchema,
  type CotizacionInmuebleFormData,
  type InmuebleWizardStepNumber,
  type AsyncCalculoState,
  type AsyncRadicacionState,
  type InspeccionArchivo,
  type TipoInmueble,
} from '../types/cotizacion-inmueble.types';
import {
  calcularValorReposicionSugerido,
  calcularContenidoSugerido,
  calcularElectroSugerido,
} from '../utils/calculoInmueble';
import {
  calcularCotizacionInmuebleApi,
  radicarCotizacionInmuebleApi,
} from '../services/cotizacionInmuebleApi';

const DEFAULT_SUPERFICIE = 75;
const DEFAULT_TIPO: TipoInmueble = 'DEPARTAMENTO';
const DEFAULT_EDIFICIO = calcularValorReposicionSugerido(DEFAULT_TIPO, DEFAULT_SUPERFICIE);
const DEFAULT_CONTENIDO = calcularContenidoSugerido(DEFAULT_EDIFICIO);
const DEFAULT_ELECTRO = calcularElectroSugerido(DEFAULT_EDIFICIO);

const INITIAL_FORM_VALUES: CotizacionInmuebleFormData = {
  calle: '',
  numero: '',
  piso: '',
  depto: '',
  codigoPostal: '1425',
  ciudad: 'Ciudad Autónoma de Buenos Aires',
  provincia: 'Buenos Aires',
  tipoInmueble: DEFAULT_TIPO,
  superficieM2: DEFAULT_SUPERFICIE,
  anioConstruccion: 2015,
  tipoTecho: 'LOSA_HORMIGON',

  alarmaMonitoreada: true,
  rejasPerimetrales: true,
  puertaBlindada: true,
  camarasVigilancia: false,

  sumaEdificio: DEFAULT_EDIFICIO,
  sumaContenido: DEFAULT_CONTENIDO,
  sumaElectrodomesticos: DEFAULT_ELECTRO,
  sumaRCLinderos: 20000000,

  tipoDocumentoTitularidad: 'ESCRITURA',
  archivos: [],
};

/**
 * Custom Hook: useCotizacionInmueble
 *
 * Administra el estado completo del Wizard de 4 pasos para cotización de Inmuebles,
 * navegación, validación Zod reactiva, cálculo actuarial en vivo (API + fallback local),
 * gestión de archivos para inspección digital y radicación final.
 */
export function useCotizacionInmueble(onRadicacionExitosa?: () => void) {
  const [currentStep, setCurrentStep] = useState<InmuebleWizardStepNumber>(1);
  const [asyncCalculo, setAsyncCalculo] = useState<AsyncCalculoState>({
    status: 'idle',
    data: null,
    error: null,
  });
  const [asyncRadicacion, setAsyncRadicacion] = useState<AsyncRadicacionState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const form = useForm<CotizacionInmuebleFormData>({
    resolver: zodResolver(CotizacionInmuebleFormSchema),
    defaultValues: INITIAL_FORM_VALUES,
    mode: 'onTouched',
  });

  const { register, watch, setValue, formState: { errors } } = form;

  const tipoInmueble = watch('tipoInmueble');
  const superficieM2 = watch('superficieM2');
  const sumaEdificio = watch('sumaEdificio');
  const sumaContenido = watch('sumaContenido');
  const sumaElectrodomesticos = watch('sumaElectrodomesticos');
  const sumaRCLinderos = watch('sumaRCLinderos');
  const alarmaMonitoreada = watch('alarmaMonitoreada');
  const rejasPerimetrales = watch('rejasPerimetrales');
  const puertaBlindada = watch('puertaBlindada');
  const camarasVigilancia = watch('camarasVigilancia');
  const archivos = watch('archivos') || [];

  // Recalcular valor de reposición sugerido cuando cambian m² o tipo de inmueble
  const sugeridoEdificio = calcularValorReposicionSugerido(tipoInmueble, superficieM2);

  const aplicarValoresSugeridos = useCallback(() => {
    const nuevoEdificio = calcularValorReposicionSugerido(tipoInmueble, superficieM2);
    setValue('sumaEdificio', nuevoEdificio, { shouldValidate: true });
    setValue('sumaContenido', calcularContenidoSugerido(nuevoEdificio), { shouldValidate: true });
    setValue('sumaElectrodomesticos', calcularElectroSugerido(nuevoEdificio), { shouldValidate: true });
  }, [tipoInmueble, superficieM2, setValue]);

  // Cálculo actuarial debounced
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ejecutarCalculo = useCallback(async () => {
    setAsyncCalculo((prev) => ({ status: 'calculating', data: prev.data, error: null }));

    const coberturas = {
      sumaEdificio: Number(sumaEdificio) || sugeridoEdificio,
      sumaContenido: Number(sumaContenido) || calcularContenidoSugerido(sugeridoEdificio),
      sumaElectrodomesticos: Number(sumaElectrodomesticos) || calcularElectroSugerido(sugeridoEdificio),
      sumaRCLinderos: Number(sumaRCLinderos) || 20000000,
      alarmaMonitoreada: Boolean(alarmaMonitoreada),
      rejasPerimetrales: Boolean(rejasPerimetrales),
      puertaBlindada: Boolean(puertaBlindada),
      camarasVigilancia: Boolean(camarasVigilancia),
    };

    try {
      const res = await calcularCotizacionInmuebleApi(
        coberturas,
        Number(superficieM2),
        tipoInmueble
      );
      setAsyncCalculo({ status: 'success', data: res, error: null });
    } catch {
      setAsyncCalculo({
        status: 'error',
        data: null,
        error: 'No se pudo obtener el cálculo actuarial en este momento.',
      });
    }
  }, [
    sumaEdificio,
    sugeridoEdificio,
    sumaContenido,
    sumaElectrodomesticos,
    sumaRCLinderos,
    alarmaMonitoreada,
    rejasPerimetrales,
    puertaBlindada,
    camarasVigilancia,
    superficieM2,
    tipoInmueble,
  ]);

  // Disparar recálculo cuando se modifica cualquier cobertura o parámetro del paso 2
  useEffect(() => {
    if (currentStep >= 2) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        ejecutarCalculo();
      }, 300);
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [
    currentStep,
    superficieM2,
    tipoInmueble,
    sumaEdificio,
    sumaContenido,
    sumaElectrodomesticos,
    sumaRCLinderos,
    alarmaMonitoreada,
    rejasPerimetrales,
    puertaBlindada,
    camarasVigilancia,
    ejecutarCalculo,
  ]);

  // Manejo de Carga de Archivos e Imágenes de Inspección
  const agregarArchivo = useCallback(
    (tipo: InspeccionArchivo['tipo'], file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = (e.target?.result as string) || '';
        const nuevoArchivo: InspeccionArchivo = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          tipo,
          nombreArchivo: file.name,
          tamanoBytes: file.size,
          previewUrl,
          tipoMime: file.type,
          fechaCarga: new Date().toISOString(),
        };

        const currentArchivos = form.getValues('archivos') || [];
        const filtrados = currentArchivos.filter((a) => a.tipo !== tipo);
        const actualizados = [...filtrados, nuevoArchivo];
        setValue('archivos', actualizados, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    },
    [form, setValue]
  );

  const eliminarArchivo = useCallback(
    (id: string) => {
      const currentArchivos = form.getValues('archivos') || [];
      const actualizados = currentArchivos.filter((a) => a.id !== id);
      setValue('archivos', actualizados, { shouldValidate: true });
    },
    [form, setValue]
  );

  // Validación de documentos de inspección
  const tieneFotoFachada = archivos.some((a) => a.tipo === 'FACHADA');
  const tieneFotoCerraduraRejas = archivos.some((a) => a.tipo === 'CERRADURA_REJAS');
  const requiereFotoAlarma = alarmaMonitoreada || camarasVigilancia;
  const tieneFotoAlarma = archivos.some((a) => a.tipo === 'ALARMA_CAMARAS');
  const tieneDocumentoTitularidad = archivos.some((a) => a.tipo === 'TITULARIDAD');

  const inspeccionCompleta =
    tieneFotoFachada &&
    tieneFotoCerraduraRejas &&
    (!requiereFotoAlarma || tieneFotoAlarma) &&
    tieneDocumentoTitularidad;

  // Navegación de Pasos
  const goToNextStep = useCallback(async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger([
        'calle',
        'numero',
        'piso',
        'depto',
        'codigoPostal',
        'ciudad',
        'provincia',
        'tipoInmueble',
        'superficieM2',
        'anioConstruccion',
        'tipoTecho',
      ]);
      if (isValid) {
        // Inicializar o refrescar cálculo actuarial al entrar a paso 2
        await ejecutarCalculo();
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      isValid = await form.trigger([
        'sumaEdificio',
        'sumaContenido',
        'sumaElectrodomesticos',
        'sumaRCLinderos',
        'alarmaMonitoreada',
        'rejasPerimetrales',
        'puertaBlindada',
        'camarasVigilancia',
      ]);
      if (isValid) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (inspeccionCompleta) {
        setCurrentStep(4);
      } else {
        form.setError('archivos', {
          type: 'manual',
          message: 'Debes cargar todas las fotos requeridas y el documento de titularidad para continuar.',
        });
      }
    }
  }, [currentStep, form, ejecutarCalculo, inspeccionCompleta]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as InmuebleWizardStepNumber);
  }, []);

  const goToStep = useCallback((step: InmuebleWizardStepNumber) => {
    setCurrentStep(step);
  }, []);

  // Radicación Final
  const radicarCotizacion = useCallback(async () => {
    if (!asyncCalculo.data) {
      await ejecutarCalculo();
    }
    const calculoActual = asyncCalculo.data;
    if (!calculoActual) return;

    setAsyncRadicacion({ status: 'submitting', data: null, error: null });

    try {
      const formData = form.getValues();
      const resultado = await radicarCotizacionInmuebleApi(formData, calculoActual);
      setAsyncRadicacion({ status: 'success', data: resultado, error: null });
      if (onRadicacionExitosa) {
        onRadicacionExitosa();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al radicar la cotización de inmueble';
      setAsyncRadicacion({ status: 'error', data: null, error: msg });
    }
  }, [asyncCalculo.data, ejecutarCalculo, form, onRadicacionExitosa]);

  const resetWizard = useCallback(() => {
    form.reset(INITIAL_FORM_VALUES);
    setCurrentStep(1);
    setAsyncCalculo({ status: 'idle', data: null, error: null });
    setAsyncRadicacion({ status: 'idle', data: null, error: null });
  }, [form]);

  return {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetWizard,

    // Form
    form,
    register,
    watch,
    setValue,
    errors,
    sugeridoEdificio,
    aplicarValoresSugeridos,

    // Archivos de Inspección
    archivos,
    agregarArchivo,
    eliminarArchivo,
    inspeccionCompleta,
    requiereFotoAlarma,
    tieneFotoFachada,
    tieneFotoCerraduraRejas,
    tieneFotoAlarma,
    tieneDocumentoTitularidad,

    // Cálculos y Radicación
    asyncCalculo,
    recalcular: ejecutarCalculo,
    asyncRadicacion,
    radicarCotizacion,
  };
}
