import React, { useState } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  Trash2,
  FileText,
  FileCheck,
  AlertCircle,
  Eye,
  ShieldCheck,
  Building,
  KeyRound,
  Bell,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type {
  CotizacionInmuebleFormData,
  InspeccionArchivo,
  TipoDocumentoTitularidad,
} from '../types/cotizacion-inmueble.types';

export interface Paso3InspeccionDigitalProps {
  watch: UseFormWatch<CotizacionInmuebleFormData>;
  setValue: UseFormSetValue<CotizacionInmuebleFormData>;
  archivos: InspeccionArchivo[];
  onAgregarArchivo: (tipo: InspeccionArchivo['tipo'], file: File) => void;
  onEliminarArchivo: (id: string) => void;
  inspeccionCompleta: boolean;
  requiereFotoAlarma: boolean;
  error?: string;
}

interface UploadSlotConfig {
  tipo: InspeccionArchivo['tipo'];
  titulo: string;
  subtitulo: string;
  requerido: boolean;
  icono: React.ComponentType<{ className?: string }>;
  ejemploTexto: string;
}

export const Paso3InspeccionDigital: React.FC<Paso3InspeccionDigitalProps> = ({
  watch,
  setValue,
  archivos,
  onAgregarArchivo,
  onEliminarArchivo,
  inspeccionCompleta,
  requiereFotoAlarma,
  error,
}) => {
  const tipoDocumento = watch('tipoDocumentoTitularidad');
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const getArchivoPorTipo = (tipo: InspeccionArchivo['tipo']) =>
    archivos.find((a) => a.tipo === tipo);

  const SLOTS: UploadSlotConfig[] = [
    {
      tipo: 'FACHADA',
      titulo: 'Fachada Exterior y Número',
      subtitulo: 'Foto de frente visible con número municipal legible',
      requerido: true,
      icono: Building,
      ejemploTexto: 'Permite al perito verificar altura y condición exterior.',
    },
    {
      tipo: 'CERRADURA_REJAS',
      titulo: 'Cerradura y Rejas',
      subtitulo: 'Detalle de cerradura principal y aberturas aseguradas',
      requerido: true,
      icono: KeyRound,
      ejemploTexto: 'Valida los cerrojos de seguridad para la bonificación.',
    },
    {
      tipo: 'ALARMA_CAMARAS',
      titulo: 'Panel de Alarma o Cámaras',
      subtitulo: requiereFotoAlarma
        ? 'Requerido para convalidar el -10% de descuento declarado'
        : 'Opcional (no declaraste poseer alarma ni cámaras)',
      requerido: requiereFotoAlarma,
      icono: Bell,
      ejemploTexto: 'Foto del teclado o domo IP en funcionamiento.',
    },
    {
      tipo: 'TITULARIDAD',
      titulo: 'Documento de Titularidad',
      subtitulo: 'Escritura pública, boleto o contrato de locación',
      requerido: true,
      icono: FileText,
      ejemploTexto: 'Acredita el interés asegurable sobre el inmueble.',
    },
  ];

  // Cálculo de progreso de documentos
  const totalRequeridos = requiereFotoAlarma ? 4 : 3;
  let completados = 0;
  if (getArchivoPorTipo('FACHADA')) completados++;
  if (getArchivoPorTipo('CERRADURA_REJAS')) completados++;
  if (requiereFotoAlarma && getArchivoPorTipo('ALARMA_CAMARAS')) completados++;
  if (getArchivoPorTipo('TITULARIDAD')) completados++;

  const progresoPct = Math.round((completados / totalRequeridos) * 100);

  const handleFileChange = (tipo: InspeccionArchivo['tipo'], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAgregarArchivo(tipo, file);
      // Reset input value to allow re-uploading same file name if needed
      e.target.value = '';
    }
  };

  const handleDrop = (tipo: InspeccionArchivo['tipo'], e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSlot(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onAgregarArchivo(tipo, file);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-slide-up text-left">
      {/* 1. Encabezado e Instrucciones de Inspección 100% Digital */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-title text-base sm:text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#006e2f]" />
            <span>Inspección Digital Previa del Inmueble</span>
          </h3>
          <p className="font-body text-xs text-gray-500">
            Sube fotos nítidas tomadas con tu smartphone para la emisión de póliza sin perito presencial
          </p>
        </div>

        <Badge variant={inspeccionCompleta ? 'primary' : 'secondary'} className="self-start sm:self-auto text-xs py-1">
          {inspeccionCompleta ? '✓ 100% Documentación Completa' : `${completados} de ${totalRequeridos} Documentos Listos`}
        </Badge>
      </div>

      {/* Selector de Tipo de Documento de Titularidad */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
        <label className="font-title text-xs font-bold text-[#0b1c30] flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#006e2f]" />
          <span>Vínculo Jurídico con el Inmueble (Titularidad)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(
            [
              { id: 'ESCRITURA', label: 'Propietario (Escritura Pública)' },
              { id: 'BOLETO_COMPRAVENTA', label: 'Poseedor (Boleto Compraventa)' },
              { id: 'CONTRATO_ALQUILER', label: 'Inquilino (Contrato de Alquiler)' },
            ] as const
          ).map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => setValue('tipoDocumentoTitularidad', doc.id as TipoDocumentoTitularidad, { shouldValidate: true })}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                tipoDocumento === doc.id
                  ? 'bg-[#006e2f]/10 border-[#006e2f] text-[#006e2f] ring-1 ring-[#006e2f]'
                  : 'bg-gray-50/50 hover:bg-gray-100 border-gray-200 text-gray-700'
              }`}
            >
              {doc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Grilla de Subida de Fotos (Drag & Drop Interactivo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SLOTS.map((slot) => {
          const Icon = slot.icono;
          const archivo = getArchivoPorTipo(slot.tipo);
          const isDragOver = dragOverSlot === slot.tipo;
          const inputId = `file-input-${slot.tipo}`;

          return (
            <div
              key={slot.tipo}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlot(slot.tipo);
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => handleDrop(slot.tipo, e)}
              className={`relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between min-h-[190px] ${
                archivo
                  ? 'bg-white border-emerald-300 shadow-sm'
                  : isDragOver
                  ? 'bg-emerald-50/80 border-[#006e2f] border-dashed ring-2 ring-[#22c55e]/40'
                  : 'bg-white/80 hover:bg-white border-dashed border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                id={inputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => handleFileChange(slot.tipo, e)}
              />

              {/* Cabecera del Slot */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        archivo ? 'bg-[#006e2f] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-title text-sm font-bold text-[#0b1c30]">
                      {slot.titulo}
                    </h4>
                  </div>

                  {slot.requerido ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Obligatorio
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      Opcional
                    </span>
                  )}
                </div>

                <p className="font-body text-xs text-gray-500 leading-snug">
                  {slot.subtitulo}
                </p>
              </div>

              {/* Cuerpo: Preview o Zona de Arrastre */}
              {archivo ? (
                <div className="my-3 p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {archivo.previewUrl.startsWith('data:image') ? (
                      <div className="relative group cursor-pointer" onClick={() => setPreviewModalUrl(archivo.previewUrl)}>
                        <img
                          src={archivo.previewUrl}
                          alt={slot.titulo}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-xs"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-title text-xs font-bold text-[#0b1c30] truncate">
                        {archivo.nombreArchivo}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {(archivo.tamanoBytes / (1024 * 1024)).toFixed(2)} MB • Listo para peritaje
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEliminarArchivo(archivo.id)}
                    aria-label={`Eliminar ${slot.titulo}`}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor={inputId}
                  className="my-3 py-4 px-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 hover:bg-emerald-50/30 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-7 h-7 text-gray-400 group-hover:text-[#006e2f] mb-1.5" />
                  <p className="text-xs font-semibold text-[#006e2f]">
                    Haz clic o arrastra el archivo aquí
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    JPG, PNG o PDF (hasta 10 MB)
                  </p>
                </label>
              )}

              {/* Pie con texto de ejemplo */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                <span>{slot.ejemploTexto}</span>
                {archivo && (
                  <span className="text-[#006e2f] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Cargado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Checklist de Validación y Barra de Progreso */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#006e2f]" />
            <h4 className="font-title text-sm font-bold text-[#0b1c30]">
              Checklist de Requisitos para Aprobación Inmediata
            </h4>
          </div>
          <span className="font-title text-xs font-bold text-[#006e2f]">
            {progresoPct}% Completado
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#006e2f] to-[#22c55e] h-full transition-all duration-300 ease-out"
            style={{ width: `${progresoPct}%` }}
          />
        </div>

        {/* Items del Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            {getArchivoPorTipo('FACHADA') ? (
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
            )}
            <span>Foto de fachada exterior y numeración</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            {getArchivoPorTipo('CERRADURA_REJAS') ? (
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
            )}
            <span>Foto de cerradura principal y rejas</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            {!requiereFotoAlarma || getArchivoPorTipo('ALARMA_CAMARAS') ? (
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
            )}
            <span>Foto de alarma / cámaras ({requiereFotoAlarma ? 'Requerida' : 'No aplica'})</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            {getArchivoPorTipo('TITULARIDAD') ? (
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
            )}
            <span>Documento de titularidad o contrato</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Modal flotante simple de preview de imagen grande */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
            <img
              src={previewModalUrl}
              alt="Vista previa ampliada"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center">
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="text-xs font-bold text-[#006e2f] hover:underline"
              >
                Cerrar vista previa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
