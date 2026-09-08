import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchDashboardSummary,
  fetchClientPolicies,
  fetchClientActivity,
} from '../services/dashboardApi';
import type {
  DashboardSummaryResponse,
  ApiPolicy,
  ApiActivity,
} from '../services/dashboardApi';
import { authStorage } from '@/features/auth/services/authStorage';

/**
 * Custom Hook for fetching and synchronizing real-time client dashboard data.
 * Consumes PostgreSQL views and procedures via Express REST API.
 *
 * @hook
 * @layer Presentation / Feature Hook
 * @module features/dashboard/hooks/useDashboardData
 * @returns {Object} State and operations for dashboard metrics and activity.
 */
export function useDashboardData() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [policies, setPolicies] = useState<ApiPolicy[]>([]);
  const [activity, setActivity] = useState<ApiActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsLoading(true);
      setError(null);
    }

    if (!authStorage.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      const results = await Promise.allSettled([
        fetchDashboardSummary(),
        fetchClientPolicies(),
        fetchClientActivity(10),
      ]);

      if (!isMountedRef.current) return;

      const [summaryResult, policiesResult, activityResult] = results;

      if (summaryResult.status === 'fulfilled') {
        setSummary(summaryResult.value);
      }
      if (policiesResult.status === 'fulfilled') {
        setPolicies(policiesResult.value);
      }
      if (activityResult.status === 'fulfilled') {
        setActivity(activityResult.value);
      }

      // Check if all rejected
      const allFailed = results.every((r) => r.status === 'rejected');
      if (allFailed) {
        const firstRejection = results.find((r) => r.status === 'rejected') as PromiseRejectedResult;
        const errMsg = firstRejection.reason instanceof Error
          ? firstRejection.reason.message
          : 'Error al conectar con los servicios de SecureLife';
        setError(errMsg);
      }
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      const message = err instanceof Error ? err.message : 'Error al conectar con los servicios de SecureLife';
      setError(message);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void loadData();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadData]);

  return {
    summary,
    policies,
    activity,
    isLoading,
    error,
    refresh: () => loadData(true),
  };
}

