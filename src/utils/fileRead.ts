import { readFile } from 'fs/promises';

export async function readFileSyncWithMetadata(path: string): Promise<{ content: string; size: number }> {
  const content = await readFile(path, 'utf-8');
  return { content, size: content.length };
}
