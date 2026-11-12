'use client';

import PageContainer from '@/components/layout/PageContainer';
import ErrorFallback from '@/components/ui/ErrorFallback';

export default function GlobalError({ error, reset }) {
  return (
    <PageContainer>
      <ErrorFallback
        title="Route Rendering Error"
        description={
          error?.message || 'An unexpected error occurred while rendering this RIVALRY 90 view.'
        }
        onRetry={reset}
      />
    </PageContainer>
  );
}
