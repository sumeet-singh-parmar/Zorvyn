import { useFiltersStore } from '@stores/filters-store';

export function useTransactionFilters() {
  const store = useFiltersStore();

  const activeFilterCount = [
    store.dateRange,
    store.selectedAccountId,
    store.selectedCategoryId,
    store.selectedType,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return { ...store, activeFilterCount, hasActiveFilters };
}
