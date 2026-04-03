import { glob as fastGlob } from 'fast-glob';
export async function glob(pattern: string, options?: any): Promise<string[]> {
  return await fastGlob(pattern, options);
}
export function globSync(pattern: string, options?: any): string[] {
  return fastGlob.sync(pattern, options);
}
