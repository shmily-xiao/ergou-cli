export interface SettingsCache {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
}

export function createSettingsCache(): SettingsCache {
  const cache = new Map<string, unknown>();
  
  return {
    get: (key) => cache.get(key) as any,
    set: (key, value) => cache.set(key, value),
    has: (key) => cache.has(key),
    delete: (key) => cache.delete(key),
    clear: () => cache.clear(),
  };
}

export const settingsCache = createSettingsCache();
