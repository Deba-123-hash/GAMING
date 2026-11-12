import { create } from 'zustand';
import { FORMATIONS } from '@/lib/constants';

function buildInitialSlots(formationKey = '4-3-3', prefill = true) {
  const template = FORMATIONS[formationKey] || FORMATIONS['4-3-3'];
  return template.slots.map((role, index) => ({
    slotIndex: index,
    role,
    playerId: prefill && index === 9 ? 'kai-vance' : null,
  }));
}

export const useGameStore = create((set) => ({
  selectedGameMode: 'quick-match',
  selectedTeamId: 'apex-united',
  squadName: 'Apex Starting XI',
  formation: '4-3-3',
  squadSlots: buildInitialSlots('4-3-3', true),
  substitutes: [],
  captainPlayerId: 'kai-vance',
  tactics: {
    mentality: 'Balanced',
    pressing: 'Balanced',
  },
  setSelectedGameMode: (selectedGameMode) => set({ selectedGameMode }),
  setSelectedTeamId: (selectedTeamId) => set({ selectedTeamId }),
  setSquadName: (squadName) => set({ squadName }),
  setCaptainPlayerId: (captainPlayerId) => set({ captainPlayerId }),
  setTactics: (next) => set((state) => ({ tactics: { ...state.tactics, ...next } })),
  setFormation: (formation) =>
    set((state) => {
      const template = FORMATIONS[formation] || FORMATIONS['4-3-3'];
      return {
        formation,
        squadSlots: template.slots.map((role, index) => ({
          slotIndex: index,
          role,
          playerId: state.squadSlots[index]?.playerId || null,
        })),
      };
    }),
  assignPlayerToSlot: (slotIndex, playerId) =>
    set((state) => ({
      squadSlots: state.squadSlots.map((slot) => {
        if (slot.slotIndex === slotIndex) {
          return { ...slot, playerId };
        }
        if (playerId && slot.playerId === playerId) {
          return { ...slot, playerId: null };
        }
        return slot;
      }),
      substitutes: playerId ? state.substitutes.filter((id) => id !== playerId) : state.substitutes,
    })),
  toggleSubstitute: (playerId) =>
    set((state) => {
      if (!playerId) return state;
      const alreadySub = state.substitutes.includes(playerId);
      if (alreadySub) {
        return {
          substitutes: state.substitutes.filter((id) => id !== playerId),
        };
      }
      if (state.substitutes.length >= 7) return state;
      return {
        squadSlots: state.squadSlots.map((slot) =>
          slot.playerId === playerId ? { ...slot, playerId: null } : slot
        ),
        substitutes: [...state.substitutes, playerId],
      };
    }),
  resetSquad: () =>
    set((state) => ({
      activeSquadId: null,
      squadSlots: buildInitialSlots(state.formation, false),
      substitutes: [],
      captainPlayerId: null,
    })),
  activeSquadId: null,
  loadSquadSnapshot: (squad) =>
    set(() => ({
      activeSquadId: squad?.id || null,
      squadName: squad?.name || 'Apex Starting XI',
      formation: squad?.formation || '4-3-3',
      squadSlots: Array.isArray(squad?.slots) ? squad.slots : buildInitialSlots('4-3-3', false),
      substitutes: Array.isArray(squad?.substitutes) ? squad.substitutes : [],
      captainPlayerId: squad?.captainPlayerId || null,
      tactics: squad?.tactics || { mentality: 'Balanced', pressing: 'Balanced' },
    })),
}));
