export const ANIMATION_STATES = {
  IDLE: 'idle',
  WALK: 'walking',
  RUN: 'running',
  SPRINT: 'running',
  DRIBBLE: 'dribbling',
  PASS: 'shooting',
  SHOOT: 'shooting',
  TACKLE: 'dribbling',
  JUMP: 'celebration',
  CELEBRATE: 'celebration',
};

const VALID_TRANSITIONS = {
  IDLE: ['IDLE', 'WALK', 'RUN', 'CELEBRATE', 'JUMP'],
  WALK: ['IDLE', 'WALK', 'RUN', 'DRIBBLE'],
  RUN: ['IDLE', 'WALK', 'RUN', 'SPRINT', 'DRIBBLE', 'TACKLE', 'SHOOT'],
  SPRINT: ['RUN', 'DRIBBLE', 'SHOOT', 'TACKLE'],
  DRIBBLE: ['IDLE', 'WALK', 'RUN', 'PASS', 'SHOOT'],
  PASS: ['IDLE', 'RUN', 'DRIBBLE'],
  SHOOT: ['IDLE', 'CELEBRATE'],
  TACKLE: ['IDLE', 'WALK', 'RUN'],
  JUMP: ['IDLE', 'RUN'],
  CELEBRATE: ['IDLE', 'WALK'],
};

export function canTransitionAnimation(fromState, toState) {
  const fromKey = String(fromState || 'IDLE').toUpperCase();
  const toKey = String(toState || 'IDLE').toUpperCase();
  const allowed = VALID_TRANSITIONS[fromKey];
  if (!allowed) return false;
  return allowed.includes(toKey);
}

export function nextAnimationState(currentState, requestedState) {
  const toKey = String(requestedState || 'IDLE').toUpperCase();
  if (!VALID_TRANSITIONS[toKey]) {
    return String(currentState || 'IDLE').toUpperCase();
  }
  if (canTransitionAnimation(currentState, toKey)) {
    return toKey;
  }
  return toKey;
}

export function resolveClipId(stateKey) {
  const upper = String(stateKey || 'IDLE').toUpperCase();
  return ANIMATION_STATES[upper] || 'idle';
}
