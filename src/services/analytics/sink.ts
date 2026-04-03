export interface AnalyticsSink {
  track(event: string, data?: any): void;
  flush(): Promise<void>;
}

export function createAnalyticsSink(): AnalyticsSink {
  return {
    track: () => {},
    flush: async () => {},
  };
}

export async function initializeAnalyticsGates(): Promise<void> {
  // No-op for now
}

export const analyticsSink = createAnalyticsSink();
