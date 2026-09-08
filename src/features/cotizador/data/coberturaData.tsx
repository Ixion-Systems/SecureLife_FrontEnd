import React from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Heart,
  User,
  Users,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import type { SelectOption } from '@/components/ui/Select';
import type { CoberturaTipo } from '../types/cotizacion-auto.types';

export interface CoberturaOption {
  tipo: CoberturaTipo;
  title: string;
  badge: string;
  isPopular?: boolean;
  icon: React.ReactNode;
  description: string;
  features: string[];
}

export const PARENTESCO_OPTIONS: SelectOption[] = [
  {
    value: 'Cónyuge / Pareja',
    label: 'Cónyuge / Pareja',
    sublabel: 'Conviviente o cónyuge legal',
    icon: <Heart className="w-3.5 h-3.5 text-rose-500" />,
  },
  {
    value: 'Hijo / Hija',
    label: 'Hijo / Hija',
    sublabel: 'Familiar directo descendiente',
    icon: <User className="w-3.5 h-3.5 text-blue-500" />,
  },
  {
    value: 'Padre / Madre',
    label: 'Padre / Madre',
    sublabel: 'Familiar directo ascendiente',
    icon: <Users className="w-3.5 h-3.5 text-amber-500" />,
  },
  {
    value: 'Hermano / Hermana',
    label: 'Hermano / Hermana',
    sublabel: 'Familiar colateral',
    icon: <Users className="w-3.5 h-3.5 text-emerald-500" />,
  },
  {
    value: 'Empleado / Chofer',
    label: 'Empleado / Chofer',
    sublabel: 'Conductor bajo relación laboral',
    icon: <Briefcase className="w-3.5 h-3.5 text-slate-500" />,
  },
  {
    value: 'Familiar directo',
    label: 'Otro Familiar',
    sublabel: 'Tío/a, primo/a, sobrino/a',
    icon: <UserCheck className="w-3.5 h-3.5 text-indigo-500" />,
  },
  {
    value: 'Otro',
    label: 'Otro (Tercero Autorizado)',
    sublabel: 'Persona autorizada a conducir',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-[#006e2f]" />,
  },
];

export const COVERAGE_OPTIONS: CoberturaOption[] = [
  {
    tipo: 'RESPONSABILIDAD_CIVIL',
    title: 'Responsabilidad Civil',
    badge: 'Básica Legal',
    icon: <Shield className="w-5 h-5" />,
    description: 'Cumple con la exigencia de la Ley Nacional de Tránsito ante reclamos de terceros transportados y no transportados.',
    features: [
      'Límite legal obligatorio de RC',
      'Asistencia legal 24/7 en siniestros',
      'Auxilio mecánico básico (hasta 100 km)',
    ],
  },
  {
    tipo: 'TERCEROS_COMPLETO',
    title: 'Terceros Completo',
    badge: 'Más Elegida',
    isPopular: true,
    icon: <ShieldCheck className="w-5 h-5" />,
    description: 'La protección integral más recomendada. Respaldo total ante robo, hurto, incendio y daños por factores climáticos.',
    features: [
      'Robo o hurto total y parcial sin franquicia',
      'Incendio total y parcial',
      'Cobertura de daños por granizo e inundación',
      'Reposición de cerraduras y cristales laterales',
      'Auxilio y remolque hasta 300 km',
    ],
  },
  {
    tipo: 'TODO_RIESGO_CON_FRANQUICIA',
    title: 'Todo Riesgo con Franquicia',
    badge: 'Máxima Protección',
    icon: <ShieldAlert className="w-5 h-5" />,
    description: 'Cero preocupaciones. Cubre daños parciales y totales por accidente propio, vandalismo y siniestros con terceros.',
    features: [
      'Daños parciales por accidente con franquicia fija reducida',
      'Reposición de parabrisas y luneta sin límite de eventos',
      'Robo de neumáticos a valor de reposición a nuevo',
      'Vehículo de sustitución hasta 7 días',
      'Remolque sin límite de kilometraje nacional',
    ],
  },
];
