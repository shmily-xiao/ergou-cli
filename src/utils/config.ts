import { readFile, writeFile, mkdir } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

const CONFIG_DIR = join(homedir(), '.ergou');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export interface ErgouConfig {
  defaultProvider?: string;
  defaultModel?: string;
  providers?: Record<string, { apiKey?: string; baseUrl?: string }>;
  ui?: { theme?: 'dark' | 'light'; showTokenUsage?: boolean; showCost?: boolean };
  tools?: { autoApprove?: string[]; timeout?: number };
}

export async function loadConfig(): Promise<ErgouConfig> {
  try {
    const content = await readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export async function saveConfig(config: ErgouConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function getConfigSync(): ErgouConfig {
  return {};
}
