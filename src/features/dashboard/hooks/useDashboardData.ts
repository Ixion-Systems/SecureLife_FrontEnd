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
  const [isLoading, setIsLoading] = useState<boolean>(() => authStorage.isAuthenticated());
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const loadData = useCallback(async (signal?: AbortSignal) => {
    if (!authStorage.isAuthenticated()) {
      if (isMountedRef.current) {
        setIsLoading(false);
        setSummary(null);
        setPolicies([]);
        setActivity([]);
        setError(null);
      }
      return;
    }

    if (isMountedRef.current) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const results = await Promise.allSettled([
        fetchDashboardSummary(signal),
        fetchClientPolicies(signal),
        fetchClientActivity(10, signal),
      ]);

      if (!isMountedRef.current || signal?.aborted) return;

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
      if (!isMountedRef.current || signal?.aborted) return;
      const message = err instanceof Error ? err.message : 'Error al conectar con los servicios de SecureLife';
      setError(message);
    } finally {
      if (isMountedRef.current && !signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();

    void loadData(controller.signal);

    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, [loadData]);

  return {
    summary,
    policies,
    activity,
    isLoading,
    error,
    refresh,
  };
}

