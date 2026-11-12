import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  selectedPlayerId: 'kai-vance',
  activeAnimation: 'idle',
  positionFilter: 'ALL',
  searchQuery: '',
  setSelectedPlayerId: (selectedPlayerId) => set({ selectedPlayerId }),
  setActiveAnimation: (activeAnimation) => set({ activeAnimation }),
  setPositionFilter: (positionFilter) => set({ positionFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
