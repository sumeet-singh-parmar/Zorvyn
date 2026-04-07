import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStateStorage } from '@core/storage/mmkv';

interface FiltersState {
  dateRange: { start: string; end: string } | null;
  selectedAccountId: string | null;
  selectedCategoryId: string | null;
  selectedType: 'income' | 'expense' | 'transfer' | null;
  setDateRange: (range: { start: string; end: string } | null) => void;
  setSelectedAccountId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setSelectedType: (type: 'income' | 'expense' | 'transfer' | null) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      dateRange: null,
      selectedAccountId: null,
      selectedCategoryId: null,
      selectedType: null,
      setDateRange: (range) => set({ dateRange: range }),
      setSelectedAccountId: (id) => set({ selectedAccountId: id }),
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
      setSelectedType: (type) => set({ selectedType: type }),
      resetFilters: () =>
        set({
          dateRange: null,
          selectedAccountId: null,
          selectedCategoryId: null,
          selectedType: null,
        }),
    }),
    {
      name: 'filters-store',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
