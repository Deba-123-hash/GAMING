'use client';

import QueryProvider from '@/providers/QueryProvider';
import MotionProvider from '@/providers/MotionProvider';
import AnimationProvider from '@/components/animations/AnimationProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function AppProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <MotionProvider>
          <AnimationProvider>{children}</AnimationProvider>
        </MotionProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
