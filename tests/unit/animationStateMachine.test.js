import { describe, expect, it } from 'vitest';
import {
  canTransitionAnimation,
  nextAnimationState,
  resolveClipId,
} from '@/components/3d/animations/AnimationStateMachine';

describe('3D AnimationStateMachine', () => {
  it('validates allowed locomotion transitions', () => {
    expect(canTransitionAnimation('IDLE', 'WALK')).toBe(true);
    expect(canTransitionAnimation('RUN', 'DRIBBLE')).toBe(true);
    expect(canTransitionAnimation('DRIBBLE', 'SHOOT')).toBe(true);
    expect(canTransitionAnimation('SHOOT', 'CELEBRATE')).toBe(true);
  });

  it('resolves valid state keys to Three.js clip IDs', () => {
    expect(nextAnimationState('IDLE', 'RUN')).toBe('RUN');
    expect(resolveClipId('RUN')).toBe('running');
    expect(resolveClipId('CELEBRATE')).toBe('celebration');
    expect(resolveClipId('UNKNOWN')).toBe('idle');
  });
});
