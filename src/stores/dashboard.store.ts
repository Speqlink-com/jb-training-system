import { create } from 'zustand';
import { DashboardState } from '@/types';

interface DashboardStore extends DashboardState {
  setSelectedBranch: (branchId: string | null) => void;
  setSelectedHOA: (hoaId: string | null) => void;
  setSelectedSM: (smId: string | null) => void;
  setDateRange: (dateRange: { start: Date; end: Date }) => void;
  clearFilters: () => void;
}

const defaultDateRange = {
  start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  end: new Date()
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedBranch: null,
  selectedHOA: null,
  selectedSM: null,
  dateRange: defaultDateRange,

  setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),
  setSelectedHOA: (hoaId) => set({ selectedHOA: hoaId }),
  setSelectedSM: (smId) => set({ selectedSM: smId }),
  setDateRange: (dateRange) => set({ dateRange }),
  
  clearFilters: () => set({
    selectedBranch: null,
    selectedHOA: null,
    selectedSM: null,
    dateRange: defaultDateRange
  }),
}));