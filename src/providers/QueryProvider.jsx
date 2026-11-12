'use client';

import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '@/lib/queryClient';

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => makeQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
