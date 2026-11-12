'use client';

import { useContext, useEffect, useState } from 'react';
import { QueryClientContext } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/apiClient';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

/**
 * Provider-safe data hook: leverages TanStack QueryClient cache when mounted inside
 * QueryProvider and degrades cleanly when rendered standalone in unit tests.
 */
export function useInternalQuery({
  queryKey,
  path,
  enabled = true,
  initialData = null,
  select = (res) => res?.data,
}) {
  const queryClient = useContext(QueryClientContext);
  const serializedKey = JSON.stringify(queryKey);
  const [state, setState] = useState(() => {
    const cached = queryClient?.getQueryData(queryKey);
    return {
      data: cached ?? initialData,
      isLoading: Boolean(enabled && !cached && !initialData),
      isFetching: false,
      error: null,
    };
  });

  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    if (!enabled || !path) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await apiRequest(path, { method: 'GET' });
        if (cancelled) return;
        const parsed = select(response);
        if (queryClient) {
          queryClient.setQueryData(JSON.parse(serializedKey), parsed);
        }
        setState({
          data: parsed,
          isLoading: false,
          isFetching: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isFetching: false,
          error: err,
        }));
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, path, serializedKey, reloadTick]);

  return {
    ...state,
    refetch: () => setReloadTick((n) => n + 1),
  };
}

export function usePlayersQuery(params = {}, options = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
      qs.set(k, String(v));
    }
  });
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return useInternalQuery({
    queryKey: ['players', params],
    path: `${API_ENDPOINTS.PLAYERS.LIST}${suffix}`,
    ...options,
  });
}

export function useTeamsQuery(params = {}, options = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
      qs.set(k, String(v));
    }
  });
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return useInternalQuery({
    queryKey: ['teams', params],
    path: `${API_ENDPOINTS.TEAMS.LIST}${suffix}`,
    ...options,
  });
}

export function useGameModesQuery(options = {}) {
  return useInternalQuery({
    queryKey: ['game-modes'],
    path: API_ENDPOINTS.GAME_MODES.LIST,
    select: (res) => res?.data?.gameModes || [],
    ...options,
  });
}

export function useFormationsQuery(options = {}) {
  return useInternalQuery({
    queryKey: ['formations'],
    path: API_ENDPOINTS.SQUADS.FORMATIONS,
    select: (res) => res?.data?.formations || [],
    ...options,
  });
}

export function useSquadsQuery({ enabled = true, ...options } = {}) {
  return useInternalQuery({
    queryKey: ['squads'],
    path: API_ENDPOINTS.SQUADS.LIST,
    enabled,
    select: (res) => res?.data?.squads || [],
    ...options,
  });
}

