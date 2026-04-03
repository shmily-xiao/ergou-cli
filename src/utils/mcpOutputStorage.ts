export interface MCPOutputStorage {
  store(key: string, value: any): void;
  get(key: string): any;
  delete(key: string): void;
}
export function createMCPOutputStorage(): MCPOutputStorage {
  const storage = new Map<string, any>();
  return { store: (key, value) => storage.set(key, value), get: (key) => storage.get(key), delete: (key) => storage.delete(key) };
}
export const mcpOutputStorage = createMCPOutputStorage();
