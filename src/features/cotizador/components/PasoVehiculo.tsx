import React, { useMemo } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Car, Hash, Calendar, Gauge, Fuel } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Combobox, type ComboboxOption } from '@/components/ui/Combobox';
import type { CotizacionAutoFormData } from '../types/cotizacion-auto.types';
import {
  MARCAS_ARGENTINA,
  getModelosPorMarca,
} from '../data/marcasModelosArgentina';

export interface PasoVehiculoProps {
  register: UseFormRegister<CotizacionAutoFormData>;
  errors: FieldErrors<CotizacionAutoFormData>;
  watch: UseFormWatch<CotizacionAutoFormData>;
  setValue: UseFormSetValue<CotizacionAutoFormData>;
}

/**
 * PasoVehiculo Component
 * 
 * Step 2 of the Auto Insurance Quoting Wizard.
 * Collects technical and usage characteristics of the vehicle:
 * plate license, brand, model, production year, CNG conversion status, and average annual mileage.
 * Powered by an extensive dataset of Argentine official brands and models.
 *
 * @component
 * @layer Presentation / Feature Component
 * @module features/cotizador/components/PasoVehiculo
 * 
 * @param {PasoVehiculoProps} props - Component properties.
 * @returns {React.ReactElement} Form step view for vehicle information.
 */
export const PasoVehiculo: React.FC<PasoVehiculoProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const tieneGnc = watch('vehiculo.tieneGnc');
  const marcaSeleccionada = watch('vehiculo.marca');
  const modeloSeleccionado = watch('vehiculo.modelo');
  const anioActual = new Date().getFullYear();

  const marcasOptions = useMemo<ComboboxOption[]>(() => {
    return MARCAS_ARGENTINA.map((m) => ({
      value: m.nombre,
      label: m.nombre,
      sublabel: `${m.modelos.length} modelos oficiales`,
      badge: m.origenPrincipal || undefined,
      icon: <Car className="w-3.5 h-3.5" />,
    }));
  }, []);

  const modelosSugeridos = useMemo(
    () => getModelosPorMarca(marcaSeleccionada),
    [marcaSeleccionada]
  );

  const modelosOptions = useMemo<ComboboxOption[]>(() => {
    if (!marcaSeleccionada) {
      return [];
    }
    return modelosSugeridos.map((modelo) => ({
      value: modelo,
      label: modelo,
      sublabel: `${marcaSeleccionada} • Línea oficial`,
      icon: <Car className="w-3.5 h-3.5" />,
    }));
  }, [marcaSeleccionada, modelosSugeridos]);

  const handleMarcaChange = (nuevaMarca: string) => {
    setValue('vehiculo.marca', nuevaMarca, { shouldValidate: true, shouldDirty: true });
    const nuevosModelos = getModelosPorMarca(nuevaMarca);
    if (modeloSeleccionado && nuevosModelos.length > 0 && !nuevosModelos.includes(modeloSeleccionado)) {
      setValue('vehiculo.modelo', '', { shouldValidate: false });
    }
  };

  const handleModeloChange = (nuevoModelo: string) => {
    setValue('vehiculo.modelo', nuevoModelo, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Info */}
      <div className="text-left">
        <h3 className="font-title text-xl md:text-2xl font-bold text-[#0b1c30]">
          Información del Vehículo
        </h3>
        <p className="font-subtitle text-sm text-gray-600 mt-1">
          Identifica el automóvil a asegurar. Incluye modelos comercializados oficialmente en Argentina.
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Fila 1: Marca Combobox */}
        <Combobox
          label="Marca del Vehículo"
          placeholder="Seleccioná o escribí la marca (ej: Toyota, Fiat, VW...)"
          required
          value={marcaSeleccionada || ''}
          onChange={handleMarcaChange}
          options={marcasOptions}
          leftIcon={<Car className="w-4 h-4" />}
          defaultOptionIcon={<Car className="w-3.5 h-3.5" />}
          error={errors.vehiculo?.marca?.message}
          helperText="Todas las marcas oficiales en Argentina"
          emptyMessage="No figura en el catálogo oficial de marcas"
          emptyActionText="Usar esta marca personalizada"
        />

        {/* Fila 1: Modelo y Versión Combobox */}
        <Combobox
          label="Modelo y Versión"
          placeholder={
            modelosSugeridos.length > 0
              ? `Modelos sugeridos para ${marcaSeleccionada}...`
              : 'Ej: Cronos, Hilux, 208, Amarok, Cruze...'
          }
          required
          value={modeloSeleccionado || ''}
          onChange={handleModeloChange}
          options={modelosOptions}
          leftIcon={<Car className="w-4 h-4" />}
          defaultOptionIcon={<Car className="w-3.5 h-3.5" />}
          error={errors.vehiculo?.modelo?.message}
          helperText={
            modelosSugeridos.length > 0
              ? `${modelosSugeridos.length} modelos sugeridos para ${marcaSeleccionada}`
              : 'Escribí o seleccioná el modelo'
          }
          emptyMessage="No figura en el catálogo de modelos oficiales"
          emptyActionText="Usar este modelo personalizado"
        />

        {/* Fila 2: Patente / Dominio */}
        <Input
          label="Patente / Dominio"
          placeholder="Ej: AB123CD o ORO123"
          required
          maxLength={9}
          leftIcon={<Hash className="w-4 h-4" />}
          error={errors.vehiculo?.patente?.message}
          helperText="Formato nuevo (AA 123 BB) o anterior (ABC 123)"
          className="uppercase tracking-widest font-mono font-semibold"
          {...register('vehiculo.patente')}
        />

        {/* Fila 2: Año de Fabricación */}
        <Input
          label="Año de Fabricación"
          type="number"
          min={1995}
          max={anioActual + 1}
          placeholder={`Ej: ${anioActual}`}
          required
          leftIcon={<Calendar className="w-4 h-4" />}
          error={errors.vehiculo?.anio?.message}
          helperText="Vehículos desde 1995 en adelante"
          {...register('vehiculo.anio', { valueAsNumber: true })}
        />

        <Input
          label="Kilometraje Promedio Anual (km)"
          type="number"
          min={0}
          step={1000}
          placeholder="Ej: 15000"
          required
          leftIcon={<Gauge className="w-4 h-4" />}
          error={errors.vehiculo?.kilometrajePromedioAnual?.message}
          helperText="Menos de 10.000 km bonifica tu prima mensual"
          {...register('vehiculo.kilometrajePromedioAnual', { valueAsNumber: true })}
        />

        {/* Toggle GNC */}
        <div className="flex flex-col justify-end">
          <Card
            variant="white"
            onClick={() => setValue('vehiculo.tieneGnc', !tieneGnc, { shouldValidate: true })}
            className={`cursor-pointer transition-all duration-300 p-3.5 rounded-xl border flex items-center justify-between select-none ${
              tieneGnc
                ? 'border-[#22c55e] bg-[#22c55e]/10 shadow-sm'
                : 'border-gray-200 bg-white/70 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg transition-colors ${
                  tieneGnc ? 'bg-[#22c55e] text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Fuel className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-subtitle text-xs md:text-sm font-bold text-[#0b1c30]">
                  ¿Posee equipo de GNC instalado?
                </p>
                <p className="font-body text-xs text-gray-500">
                  {tieneGnc ? 'Equipo de gas homologado declarado' : 'No cuenta con equipo de gas'}
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                tieneGnc ? 'bg-[#22c55e]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                  tieneGnc ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
