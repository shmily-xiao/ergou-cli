export function jsonStringify(obj: any, space?: number): string {
  return JSON.stringify(obj, null, space);
}
