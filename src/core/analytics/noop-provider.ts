import type { IAnalyticsProvider } from './interfaces';

export class NoopAnalyticsProvider implements IAnalyticsProvider {
  track(): void {}
  screen(): void {}
  identify(): void {}
  reset(): void {}
}

export const analytics: IAnalyticsProvider = new NoopAnalyticsProvider();
