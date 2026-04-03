export interface ThinkingConfig {
  enabled: boolean;
  maxTokens?: number;
}

export function shouldEnableThinkingByDefault(): boolean {
  return false;
}

export function createThinkingConfig(): ThinkingConfig {
  return {
    enabled: false,
  };
}
