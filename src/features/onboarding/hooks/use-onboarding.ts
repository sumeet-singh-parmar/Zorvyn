import { useMemo } from 'react';
import { useDatabase } from '@core/providers/database-provider';
import { AccountRepository } from '@core/repositories/account-repository';
import { UserPreferencesRepository } from '@core/repositories/user-preferences-repository';
import { useCurrencyStore } from '@stores/currency-store';
import { useAppStore } from '@stores/app-store';
import type { AccountType } from '@core/models';

export function useOnboarding() {
  const db = useDatabase();
  const accountRepo = useMemo(() => new AccountRepository(db), [db]);
  const prefsRepo = useMemo(() => new UserPreferencesRepository(db), [db]);
  const setCurrencyCode = useCurrencyStore((s) => s.setCurrencyCode);
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);

  const selectCurrency = async (code: string) => {
    setCurrencyCode(code);
    await prefsRepo.updatePreferences({ default_currency: code });
  };

  const createAccount = async (name: string, type: AccountType, balance: number) => {
    const currencyCode = useCurrencyStore.getState().currencyCode;
    await accountRepo.create({
      name,
      type,
      balance,
      currency_code: currencyCode,
      icon: null,
      color: null,
      is_default: 1,
      sort_order: 0,
    });
  };

  const completeOnboarding = async () => {
    await prefsRepo.updatePreferences({ onboarding_completed: 1 });
    setOnboardingCompleted(true);
  };

  return { selectCurrency, createAccount, completeOnboarding };
}
