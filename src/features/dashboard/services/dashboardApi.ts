const API_BASE_URL = 'http://localhost:3000/api/v1/dashboard';

export interface DashboardSummaryResponse {
  activePoliciesCount: number;
  nextDueAmount: number;
  nextDueDate: string | null;
  activeClaimsCount: number;
  protectionScore: number;
}

export interface ApiPolicy {
  id: string;
  policyNumber: string;
  branch: string;
  planName: string;
  annualPremium: number;
  monthlyPremium: number;
  validFrom: string;
  validUntil: string;
  status: string;
  vehicle?: {
    plate: string;
    brand: string;
    model: string;
    year: number;
    hasGnc: boolean;
  } | null;
  property?: {
    street: string;
    number: string;
    city: string;
    province: string;
    propertyType: string;
  } | null;
}

export interface ApiActivity {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  date: string;
}

import { authStorage } from '@/features/auth/services/authStorage';

function getAuthHeaders(): HeadersInit {
  const token = authStorage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  const res = await fetch(`${API_BASE_URL}/summary`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Sesión no autorizada o expirada');
  }

  if (!res.ok) {
    throw new Error('Error al consultar el resumen de métricas del servidor');
  }

  const json = await res.json();
  return json.data;
}

export async function fetchClientPolicies(): Promise<ApiPolicy[]> {
  const res = await fetch(`${API_BASE_URL}/policies`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Sesión no autorizada o expirada');
  }

  if (!res.ok) {
    throw new Error('Error al consultar las pólizas del servidor');
  }

  const json = await res.json();
  return json.data || [];
}

export async function fetchClientActivity(limit: number = 10): Promise<ApiActivity[]> {
  const res = await fetch(`${API_BASE_URL}/activity?limit=${limit}`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Sesión no autorizada o expirada');
  }

  if (!res.ok) {
    throw new Error('Error al consultar el registro de actividad del servidor');
  }

  const json = await res.json();
  return json.data || [];
}
