export interface TeammateContext {
  id: string;
  name: string;
  email?: string;
}
export function getTeammateContext(): TeammateContext | null { return null; }
export function isTeammateMode(): boolean { return false; }
