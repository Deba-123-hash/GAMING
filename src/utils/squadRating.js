function avg(numbers) {
  if (!numbers.length) return null;
  return Math.round(numbers.reduce((sum, n) => sum + n, 0) / numbers.length);
}

export function isPositionCompatible(slotRole, player) {
  if (!player) return true;
  if (player.position === slotRole) return true;
  if (Array.isArray(player.secondaryPositions) && player.secondaryPositions.includes(slotRole)) {
    return true;
  }
  const gkSlot = slotRole === 'GK';
  if (gkSlot) return player.position === 'GK';
  return player.position !== 'GK';
}

/**
 * Computes transparent estimated squad ratings excluding empty slots.
 */
export function calculateSquadRatings(slots = [], playerLookup = new Map()) {
  const filled = [];
  const gkOvrs = [];
  const defOvrs = [];
  const midOvrs = [];
  const fwdOvrs = [];
  let compatibleCount = 0;

  for (const slot of slots) {
    if (!slot?.playerId) continue;
    const player = playerLookup.get(slot.playerId);
    if (!player) continue;

    filled.push(player.ovr);
    if (isPositionCompatible(slot.role, player)) {
      compatibleCount += 1;
    }

    if (slot.role === 'GK') gkOvrs.push(player.ovr);
    else if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(slot.role)) defOvrs.push(player.ovr);
    else if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(slot.role)) midOvrs.push(player.ovr);
    else fwdOvrs.push(player.ovr);
  }

  return {
    filledCount: filled.length,
    totalSlots: slots.length || 11,
    completenessPercent: Math.round((filled.length / (slots.length || 11)) * 100),
    isComplete: filled.length === (slots.length || 11),
    overallRating: avg(filled),
    goalkeeperRating: avg(gkOvrs),
    defenceRating: avg(defOvrs),
    midfieldRating: avg(midOvrs),
    attackRating: avg(fwdOvrs),
    compatibilityPercent:
      filled.length > 0 ? Math.round((compatibleCount / filled.length) * 100) : 0,
  };
}
