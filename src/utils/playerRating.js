/**
 * Position-weighted OVR rating calculator (1-99 integer scale).
 * Never averages all attributes blindly; goalkeepers emphasize GK stats,
 * attackers emphasize shooting/dribbling/pace, etc.
 */
export function clampStat(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 50;
  return Math.max(1, Math.min(99, Math.round(num)));
}

export function calculatePositionOvr(position, stats = {}) {
  const pos = String(position || 'CM').toUpperCase();
  const pac = clampStat(stats.pace);
  const sho = clampStat(stats.shooting);
  const pas = clampStat(stats.passing);
  const dri = clampStat(stats.dribbling);
  const def = clampStat(stats.defending);
  const phy = clampStat(stats.physical);

  if (pos === 'GK') {
    return clampStat(def * 0.42 + phy * 0.25 + pas * 0.18 + pac * 0.15);
  }
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos)) {
    return clampStat(def * 0.4 + phy * 0.25 + pac * 0.18 + pas * 0.12 + dri * 0.05);
  }
  if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos)) {
    return clampStat(pas * 0.34 + dri * 0.26 + pac * 0.14 + sho * 0.12 + def * 0.08 + phy * 0.06);
  }
  return clampStat(sho * 0.36 + pac * 0.24 + dri * 0.24 + pas * 0.1 + phy * 0.06);
}
