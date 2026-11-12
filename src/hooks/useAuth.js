'use client';

import { useAuthContext } from '@/components/auth/AuthProvider';

const STAFF_ROLES = new Set(['super_admin', 'admin', 'content_manager', 'moderator']);

export default function useAuth() {
  const ctx = useAuthContext();
  const role = ctx.user?.role || null;
  const isStaff = Boolean(role && STAFF_ROLES.has(role));

  return {
    ...ctx,
    role,
    isStaff,
  };
}
