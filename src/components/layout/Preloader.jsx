'use client';

import { useUiStore } from '@/store/uiStore';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function Preloader() {
  const isLoading = useUiStore((state) => state.isLoading);
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e11]/95 backdrop-blur-md">
      <LoadingScreen label="Preparing Matchday Experience..." />
    </div>
  );
}
