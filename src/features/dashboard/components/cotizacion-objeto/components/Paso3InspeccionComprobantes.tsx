import React, { useState } from 'react';
import {
  Camera,
  UploadCloud,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type {
  InspeccionObjetoArchivo,
  TipoObjeto,
} from '../types/cotizacion-objeto.types';

export interface Paso3InspeccionComprobantesProps {
  tipoObjeto: TipoObjeto;
  archivos: InspeccionObjetoArchivo[];
  onAgregarArchivo: (tipo: InspeccionObjetoArchivo['tipo'], file: File) => void;
  onEliminarArchivo: (id: string) => void;
  onSimularCargaTodos: () => void;
  stepError?: string | null;
}

interface UploadSlotMeta {
  tipo: InspeccionObjetoArchivo['tipo'];
  title: string;
  subtitle: string;
  required: boolean;
  instruction: string;
}

export const Paso3InspeccionComprobantes: React.FC<Paso3InspeccionComprobantesProps> = ({
  tipoObjeto,
  archivos,
  onAgregarArchivo,
  onEliminarArchivo,
  onSimularCargaTodos,
  stepError,
}) => {
  const [dragOverTipo, setDragOverTipo] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const isSmartphone = tipoObjeto === 'SMARTPHONE';

  const SLOTS: UploadSlotMeta[] = [
    {
      tipo: 'FRENTE_PANTALLA',
      title: isSmartphone
        ? 'Foto del Frente (Pantalla encendida con *#06#)'
        : 'Foto Frontal del Equipo Encendido',
      subtitle: isSmartphone
        ? 'Debe verse el display encendido mostrando el código IMEI del teclado de llamadas'
        : 'Muestra la pantalla encendida o vista frontal del bien en funcionamiento',
      required: true,
      instruction: 'Acredita funcionamiento del display y legitimidad de software.',
    },
    {
      tipo: 'DORSO_SERIE',
      title: 'Foto del Dorso y Número de Serie',
      subtitle: 'Foto del reverso mostrando el número de serie grabado o sticker de fábrica',
      required: true,
      instruction: 'Permite al perito convalidar la integridad física del chasis.',
    },
    {
      tipo: 'FACTURA_COMPRA',
      title: 'Factura de Compra o Certificado Oficial',
      subtitle: 'Ticket fiscal, factura B/A, o comprobante de compra original',
      required: false,
      instruction: 'Acredita fecha de adquisición, valor inicial y titularidad.',
    },
  ];

  const getArchivo = (tipo: InspeccionObjetoArchivo['tipo']) =>
    archivos.find((a) => a.tipo === tipo);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, tipo: InspeccionObjetoArchivo['tipo']) => {
    e.preventDefault();
    setDragOverTipo(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onAgregarArchivo(tipo, e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, tipo: InspeccionObjetoArchivo['tipo']) => {
    if (e.target.files && e.target.files[0]) {
      onAgregarArchivo(tipo, e.target.files[0]);
    }
  };

  const completados = archivos.length;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner de Inspección */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#006e2f]/10 text-[#006e2f] flex items-center justify-center shrink-0 mt-0.5">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-title text-sm font-bold text-[#0b1c30]">
              Paso 3: Inspección Digital y Carga Pericial de Evidencias
            </h3>
            <p className="font-body text-xs text-gray-600 mt-0.5 leading-relaxed">
              Sube fotografías nítidas para la validación del estado del equipo por parte de la mesa
              de peritaje digital SecureLife.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSimularCargaTodos}
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#006e2f]" />}
          className="shrink-0 !text-xs !py-1.5 !px-3 !rounded-xl"
        >
          Carga Rápida Demo
        </Button>
      </div>

      {/* Barra de progreso de inspección */}
      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {completados >= 2 ? (
            <CheckCircle2 className="w-5 h-5 text-[#006e2f]" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          )}
          <span className="text-xs font-semibold text-gray-700">
            {completados >= 2
              ? `Inspección digital suficiente (${completados} de 3 documentos cargados)`
              : `Faltan documentos: ${completados} de 2 obligatorios cargados`}
          </span>
        </div>
        <Badge
          variant="secondary"
          className={`text-xs px-3 py-0.5 font-bold ${
            completados >= 2
              ? 'bg-emerald-100 text-[#006e2f] border-emerald-300'
              : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}
        >
          {completados}/3 Archivos
        </Badge>
      </div>

      {stepError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* 3 Slots de Carga */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SLOTS.map((slot) => {
          const archivo = getArchivo(slot.tipo);
          const isDragOver = dragOverTipo === slot.tipo;
          const inputId = `file-input-${slot.tipo}`;

          return (
            <div
              key={slot.tipo}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between text-left ${
                archivo
                  ? 'bg-white border-emerald-300 shadow-xs'
                  : isDragOver
                  ? 'bg-emerald-50/50 border-[#006e2f] ring-2 ring-[#006e2f]/20'
                  : 'bg-white/80 border-gray-200/90 hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-[#0b1c30] truncate">
                    {slot.tipo === 'FRENTE_PANTALLA'
                      ? '1. Frente Display'
                      : slot.tipo === 'DORSO_SERIE'
                      ? '2. Dorso / Chasis'
                      : '3. Factura de Compra'}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] py-0.2 px-2 ${
                      archivo
                        ? 'bg-emerald-50 text-[#006e2f] border-emerald-200'
                        : slot.required
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {archivo ? 'Cargado' : slot.required ? 'Obligatorio' : 'Opcional'}
                  </Badge>
                </div>

                <h4 className="font-title text-xs font-bold text-[#0b1c30] mt-2 leading-tight">
                  {slot.title}
                </h4>
                <p className="font-body text-[11px] text-gray-500 mt-1 leading-relaxed">
                  {slot.subtitle}
                </p>
              </div>

              {/* Contenedor de preview o dropzone */}
              <div className="mt-3">
                {archivo ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                    <img
                      src={archivo.previewUrl}
                      alt={slot.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-[#0b1c30]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl(archivo.previewUrl)}
                        className="p-1.5 rounded-lg bg-white/90 text-[#0b1c30] hover:bg-white cursor-pointer"
                        title="Ver foto ampliada"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEliminarArchivo(archivo.id)}
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-1.5 bg-white text-[10px] text-gray-500 truncate text-center border-t border-gray-100">
                      {archivo.nombreArchivo}
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverTipo(slot.tipo);
                    }}
                    onDragLeave={() => setDragOverTipo(null)}
                    onDrop={(e) => handleDrop(e, slot.tipo)}
                    className="border-2 border-dashed border-gray-200 hover:border-[#006e2f] rounded-xl p-4 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-emerald-50/20"
                    onClick={() => document.getElementById(inputId)?.click()}
                  >
                    <input
                      id={inputId}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, slot.tipo)}
                    />
                    <UploadCloud className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700 block">
                      Arrastra o click para subir
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">JPG, PNG o PDF</span>
                  </div>
                )}
              </div>

              <div className="mt-2 text-[10px] text-gray-400 italic">
                {slot.instruction}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Lightbox de Preview */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewModalUrl}
              alt="Evidencia Pericial"
              className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto"
            />
            <div className="p-2 text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewModalUrl(null)}
                className="!text-xs !py-1 !px-3"
              >
                Cerrar Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
