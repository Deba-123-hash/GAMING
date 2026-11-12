'use client';

import { PLAYERS, getPlayerById } from '@/data/players';

export default function SquadPlayerSlot({ slot, onAssign }) {
  const assignedPlayer = slot.playerId ? getPlayerById(slot.playerId) : null;

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border border-white/10 bg-[#0b0e11] p-3.5">
      <div className="flex items-center justify-between">
        <span className="rounded bg-[#b8ff2c]/15 px-2 py-0.5 font-mono text-xs font-bold text-[#b8ff2c]">
          {slot.role}
        </span>
        <span className="font-mono text-xs text-[#6f7c87]">
          {assignedPlayer ? `OVR ${assignedPlayer.ovr}` : 'Open'}
        </span>
      </div>

      <select
        aria-label={`Select player for ${slot.role} slot ${slot.slotIndex + 1}`}
        value={slot.playerId || ''}
        onChange={(e) => onAssign(slot.slotIndex, e.target.value || null)}
        className="w-full rounded border border-white/15 bg-[#12171d] px-2.5 py-1.5 text-xs text-[#f5f4ee]"
      >
        <option value="">— Assign Athlete —</option>
        {PLAYERS.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name} ({player.position} · {player.ovr})
          </option>
        ))}
      </select>
    </div>
  );
}
