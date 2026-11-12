'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    authenticated: false,
    user: null,
    profile: null,
    expiresAt: null,
  });

  const refreshSession = useCallback(async () => {
    try {
      const res = await apiRequest('/api/auth/session', { method: 'GET' });
      const payload = res?.data || {};
      setState({
        loading: false,
        authenticated: Boolean(payload.authenticated),
        user: payload.user || null,
        profile: payload.profile || null,
        expiresAt: payload.expiresAt || null,
      });
      return payload;
    } catch {
      setState({
        loading: false,
        authenticated: false,
        user: null,
        profile: null,
        expiresAt: null,
      });
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest('/api/auth/session', { method: 'GET' });
        if (cancelled) return;
        const payload = res?.data || {};
        setState({
          loading: false,
          authenticated: Boolean(payload.authenticated),
          user: payload.user || null,
          profile: payload.profile || null,
          expiresAt: payload.expiresAt || null,
        });
      } catch {
        if (cancelled) return;
        setState({
          loading: false,
          authenticated: false,
          user: null,
          profile: null,
          expiresAt: null,
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
    const payload = res?.data || {};
    setState({
      loading: false,
      authenticated: true,
      user: payload.user || null,
      profile: payload.profile || null,
      expiresAt: null,
    });
    return res;
  }, []);

  const register = useCallback(async (formPayload) => {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: formPayload,
    });
    const payload = res?.data || {};
    setState({
      loading: false,
      authenticated: true,
      user: payload.user || null,
      profile: payload.profile || null,
      expiresAt: null,
    });
    return res;
  }, []);

  const logout = useCallback(async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    setState({
      loading: false,
      authenticated: false,
      user: null,
      profile: null,
      expiresAt: null,
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      refreshSession,
      login,
      register,
      logout,
    }),
    [state, refreshSession, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      loading: false,
      authenticated: false,
      user: null,
      profile: null,
      expiresAt: null,
      refreshSession: async () => null,
      login: async () => null,
      register: async () => null,
      logout: async () => null,
    };
  }
  return ctx;
}
