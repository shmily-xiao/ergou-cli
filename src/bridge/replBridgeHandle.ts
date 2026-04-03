export interface REPLBridgeHandle {
  execute(command: string): Promise<string>;
  close(): void;
}
export function createREPLBridgeHandle(): REPLBridgeHandle {
  return { execute: async (command) => command, close: () => {} };
}
