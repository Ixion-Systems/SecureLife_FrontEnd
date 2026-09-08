import React, { useRef } from 'react';
import {
  Camera,
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Sparkles,
  AlertCircle,
  Eye,
} from 'lucide-react';
import type { InspeccionSlot } from './types';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';

export interface Paso3InspeccionDocumentosProps {
  slots: InspeccionSlot[];
  onUploadSlot: (slotId: string, file: { name: string; size?: number; previewUrl?: string }) => void;
  onRemoveSlot: (slotId: string) => void;
  onSimularTodos: () => void;
  completitud: {
    total: number;
    subidos: number;
    porcentaje: number;
    esCompleta: boolean;
  };
  errors: Record<string, string>;
}

export const Paso3InspeccionDocumentos: React.FC<Paso3InspeccionDocumentosProps> = ({
  slots,
  onUploadSlot,
  onRemoveSlot,
  onSimularTodos,
  completitud,
  errors,
}) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelected = (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    onUploadSlot(slotId, {
      name: file.name,
      size: file.size,
      previewUrl,
    });
  };

  const handleDrop = (slotId: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    onUploadSlot(slotId, {
      name: file.name,
      size: file.size,
      previewUrl,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const fotos = slots.filter((s) => s.categoria === 'foto');
  const documentos = slots.filter((s) => s.categoria === 'documento');

  return (
    <div className="space-y-6">
      {/* 1. BARRA DE COMPLETITUD Y ENCABEZADO */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-title text-base font-bold text-[#0b1c30] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#006e2f]" /> Inspección Digital y Documentación Obligatoria
            </h3>
            <p className="font-body text-xs text-gray-500">
              Adjunta las fotografías del rodado y la documentación legal para emisión de póliza sin esperas
            </p>
          </div>

          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={onSimularTodos}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#006e2f]" />}
            className="!rounded-xl !text-xs self-start sm:self-auto shrink-0 whitespace-nowrap"
          >
            Autocompletar Todo (Demo)
          </Button>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-subtitle font-bold">
            <span className="text-gray-700">
              Completitud de la Inspección:{' '}
              <strong className="text-[#006e2f]">
                {completitud.subidos} de {completitud.total} requisitos
              </strong>
            </span>
            <span className="text-[#006e2f]">{completitud.porcentaje}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden border border-gray-200/60">
            <div
              style={{ width: `${completitud.porcentaje}%` }}
              className="h-full bg-gradient-to-r from-[#006e2f] to-[#22c55e] transition-all duration-300 rounded-full"
            />
          </div>
        </div>

        {errors.inspeccion && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.inspeccion}</span>
          </div>
        )}
      </div>

      {/* 2. GRILLA DE FOTOGRAFÍAS DEL VEHÍCULO (7 SLOTS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#006e2f]" /> Fotografías del Vehículo (7 tomas obligatorias)
          </h4>
          <span className="text-[11px] text-gray-400 font-body">
            Formatos: JPG, PNG, WEBP (hasta 10MB)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {fotos.map((slot) => {
            return (
              <div
                key={slot.id}
                onDrop={(e) => handleDrop(slot.id, e)}
                onDragOver={handleDragOver}
                className={`relative rounded-2xl p-3.5 transition-all duration-200 border flex flex-col justify-between ${
                  slot.subido
                    ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                    : 'bg-white border-dashed border-gray-300 hover:border-[#006e2f] hover:bg-gray-50/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => {
                    fileInputRefs.current[slot.id] = el;
                  }}
                  onChange={(e) => handleFileSelected(slot.id, e)}
                  className="hidden"
                />

                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-title text-xs font-bold text-[#0b1c30]">
                        {slot.titulo}
                      </h5>
                      <p className="font-body text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                        {slot.descripcion}
                      </p>
                    </div>

                    {slot.subido ? (
                      <Badge variant="primary" className="!text-[10px] !py-0.5 !px-2 shrink-0">
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Cargado
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-semibold uppercase shrink-0">
                        Pendiente
                      </span>
                    )}
                  </div>

                  {/* Thumbnail o Dropzone */}
                  {slot.subido && slot.previewUrl ? (
                    <div className="relative h-28 rounded-xl overflow-hidden border border-emerald-200 group">
                      <img
                        src={slot.previewUrl}
                        alt={slot.titulo}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#0b1c30]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <a
                          href={slot.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/80 text-[#0b1c30] hover:bg-white text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => onRemoveSlot(slot.id)}
                          className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRefs.current[slot.id]?.click()}
                      className="h-28 rounded-xl border border-dashed border-gray-200 bg-gray-50/70 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-emerald-50/30 transition-colors p-2 text-center"
                    >
                      <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#006e2f]" />
                      <span className="text-xs font-semibold text-gray-600">
                        Hacer clic o soltar foto
                      </span>
                      <span className="text-[10px] text-gray-400">Desde tu cámara o galería</span>
                    </div>
                  )}
                </div>

                {slot.subido && (
                  <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
                    <span className="truncate max-w-[140px]">{slot.archivoNombre}</span>
                    <span className="text-gray-400 text-[10px]">{slot.archivoSize}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DOCUMENTACIÓN OBLIGATORIA (3 SLOTS) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#006e2f]" /> Documentación Obligatoria (Cédula y Licencia)
          </h4>
          <span className="text-[11px] text-gray-400 font-body">
            Formatos: JPG, PNG o PDF
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {documentos.map((slot) => {
            return (
              <div
                key={slot.id}
                onDrop={(e) => handleDrop(slot.id, e)}
                onDragOver={handleDragOver}
                className={`relative rounded-2xl p-3.5 transition-all duration-200 border flex flex-col justify-between ${
                  slot.subido
                    ? 'bg-blue-50/40 border-blue-300/80 shadow-xs'
                    : 'bg-white border-dashed border-gray-300 hover:border-blue-600 hover:bg-gray-50/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  ref={(el) => {
                    fileInputRefs.current[slot.id] = el;
                  }}
                  onChange={(e) => handleFileSelected(slot.id, e)}
                  className="hidden"
                />

                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-title text-xs font-bold text-[#0b1c30]">
                        {slot.titulo}
                      </h5>
                      <p className="font-body text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                        {slot.descripcion}
                      </p>
                    </div>

                    {slot.subido ? (
                      <Badge variant="primary" className="!bg-blue-100 !text-blue-800 !border-blue-200 !text-[10px] !py-0.5 !px-2 shrink-0">
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Verificado
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-semibold uppercase shrink-0">
                        Requerido
                      </span>
                    )}
                  </div>

                  {slot.subido && slot.previewUrl ? (
                    <div className="relative h-24 rounded-xl overflow-hidden border border-blue-200 group bg-white flex items-center justify-center">
                      <img
                        src={slot.previewUrl}
                        alt={slot.titulo}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#0b1c30]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onRemoveSlot(slot.id)}
                          className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRefs.current[slot.id]?.click()}
                      className="h-24 rounded-xl border border-dashed border-gray-200 bg-gray-50/70 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-50/30 transition-colors p-2 text-center"
                    >
                      <UploadCloud className="w-5 h-5 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600">
                        Cargar Documento
                      </span>
                      <span className="text-[10px] text-gray-400">PDF o Imagen nítida</span>
                    </div>
                  )}
                </div>

                {slot.subido && (
                  <div className="mt-2 pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
                    <span className="truncate max-w-[140px]">{slot.archivoNombre}</span>
                    <span className="text-gray-400 text-[10px]">{slot.archivoSize}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
