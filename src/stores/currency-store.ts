import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStateStorage } from '@core/storage/mmkv';

interface CurrencyState {
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currencyCode: 'INR',
      setCurrencyCode: (code) => set({ currencyCode: code }),
    }),
    {
      name: 'currency-store',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
