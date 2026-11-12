'use client';

import { useCallback } from 'react';
import { PLAYER_ANIMATION_STATES } from '@/lib/constants';
import { usePlayerStore } from '@/store/playerStore';

export default function usePlayerAnimation() {
  const activeAnimation = usePlayerStore((state) => state.activeAnimation);
  const setActiveAnimation = usePlayerStore((state) => state.setActiveAnimation);

  const selectAnimation = useCallback(
    (animationId) => {
      const valid = PLAYER_ANIMATION_STATES.some((item) => item.id === animationId);
      if (valid) {
        setActiveAnimation(animationId);
      }
    },
    [setActiveAnimation]
  );

  return {
    activeAnimation,
    animations: PLAYER_ANIMATION_STATES,
    selectAnimation,
  };
}
