import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStateStorage } from '@core/storage/mmkv';

interface FiltersState {
  dateRange: { start: string; end: string } | null;
  selectedAccountId: string | null;
  selectedCategoryId: string | null;
  selectedType: 'income' | 'expense' | 'transfer' | null;
  searchQuery: string;
  setDateRange: (range: { start: string; end: string } | null) => void;
  setSelectedAccountId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setSelectedType: (type: 'income' | 'expense' | 'transfer' | null) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      dateRange: null,
      selectedAccountId: null,
      selectedCategoryId: null,
      selectedType: null,
      searchQuery: '',
      setDateRange: (range) => set({ dateRange: range }),
      setSelectedAccountId: (id) => set({ selectedAccountId: id }),
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
      setSelectedType: (type) => set({ selectedType: type }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      resetFilters: () =>
        set({
          dateRange: null,
          selectedAccountId: null,
          selectedCategoryId: null,
          selectedType: null,
          searchQuery: '',
        }),
    }),
    {
      name: 'filters-store',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
