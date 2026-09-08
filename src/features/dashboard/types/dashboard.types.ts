export type DashboardTab =
  | 'inicio'
  | 'polizas'
  | 'cotizaciones'
  | 'siniestros'
  | 'asistencia'
  | 'certificados';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  dni: string;
  role: string;
  planLevel: string;
  avatarUrl?: string;
}

export interface MetricItem {
  id: string;
  title: string;
  value: string;
  changeText: string;
  isPositive: boolean;
  iconName: 'ShieldCheck' | 'CreditCard' | 'AlertCircle' | 'Award';
}

export interface ActivePolicy {
  id: string;
  policyNumber: string;
  branch: 'automotor' | 'hogar' | 'vida' | 'tecnologia';
  title: string;
  subtitle: string;
  status: 'Activa' | 'En Revisión' | 'Vencida';
  validUntil: string;
  monthlyPremium: string;
  vehiclePlate?: string;
  features: string[];
}

export interface RecentActivityItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'payment' | 'claim' | 'policy' | 'assistance';
  status: 'completado' | 'en_proceso' | 'aprobado';
}
