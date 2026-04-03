export type PromptCategory = 'general' | 'code' | 'debug' | 'test';
export function categorizePrompt(prompt: string): PromptCategory {
  if (prompt.includes('code') || prompt.includes('function')) return 'code';
  if (prompt.includes('bug') || prompt.includes('error')) return 'debug';
  if (prompt.includes('test')) return 'test';
  return 'general';
}
