import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isMobileMenuOpen: false,
  isLoading: false,
  qualityTier: 'high',
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setLoading: (isLoading) => set({ isLoading: Boolean(isLoading) }),
  setQualityTier: (qualityTier) => set({ qualityTier }),
}));
