import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { User, CreditCard, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import type { CotizacionAutoFormData } from '../types/cotizacion-auto.types';

export interface PasoTitularProps {
  register: UseFormRegister<CotizacionAutoFormData>;
  errors: FieldErrors<CotizacionAutoFormData>;
}

/**
 * PasoTitular Component
 * 
 * Step 1 of the Auto Insurance Quoting Wizard.
 * Collects validated personal and contact information of the policy holder.
 *
 * @component
 * @layer Presentation / Feature Component
 * @module features/cotizador/components/PasoTitular
 * 
 * @param {PasoTitularProps} props - Component properties.
 * @returns {React.ReactElement} Form step view for titular information.
 */
export const PasoTitular: React.FC<PasoTitularProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Info */}
      <div className="text-left">
        <h3 className="font-title text-xl md:text-2xl font-bold text-[#0b1c30]">
          Datos del Titular Asegurado
        </h3>
        <p className="font-subtitle text-sm text-gray-600 mt-1">
          Ingresa tus datos personales para personalizar tu cobertura y emitir tu póliza oficial.
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <Input
          label="Nombre y Apellido Completo"
          placeholder="Ej: Nicolás Gómez"
          required
          leftIcon={<User className="w-4 h-4" />}
          error={errors.titular?.nombreCompleto?.message}
          {...register('titular.nombreCompleto')}
        />

        <Input
          label="DNI / Documento"
          placeholder="Ej: 38450123"
          required
          maxLength={8}
          leftIcon={<CreditCard className="w-4 h-4" />}
          error={errors.titular?.dni?.message}
          helperText="Sin puntos ni espacios (7 u 8 dígitos)"
          {...register('titular.dni')}
        />

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="nombre@ejemplo.com"
          required
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.titular?.email?.message}
          helperText="Te enviaremos el comprobante y la póliza aquí"
          {...register('titular.email')}
        />

        <Input
          label="Teléfono de Contacto"
          type="tel"
          placeholder="Ej: 1158901234"
          required
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.titular?.telefono?.message}
          helperText="Incluye código de área sin 0 ni 15"
          {...register('titular.telefono')}
        />
      </div>

      {/* Security Privacy Callout */}
      <Card variant="white" className="p-4 rounded-xl border-emerald-100 bg-emerald-50/40">
        <div className="flex items-start gap-3 text-left">
          <div className="p-2 rounded-lg bg-[#22c55e]/20 text-[#006e2f] shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-subtitle text-xs font-bold text-[#006e2f] uppercase tracking-wider">
              Datos Protegidos con Encriptación Bancaria
            </h4>
            <p className="font-body text-xs text-gray-600 mt-0.5 leading-relaxed">
              Tu información está resguardada conforme a la Ley de Protección de Datos Personales. No compartimos tus datos con terceros sin tu consentimiento.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
