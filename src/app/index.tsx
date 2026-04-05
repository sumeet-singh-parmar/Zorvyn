import { Redirect } from 'expo-router';
import { useAppStore } from '@stores/app-store';
import { useDatabaseStatus } from '@core/providers/database-provider';
import { LoadingState } from '@components/feedback/loading-state';

export default function Index() {
  const { isReady } = useDatabaseStatus();
  const onboardingCompleted = useAppStore((s) => s.onboardingCompleted);

  if (!isReady) return <LoadingState message="Setting up..." />;
  if (!onboardingCompleted) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(tabs)" />;
}
