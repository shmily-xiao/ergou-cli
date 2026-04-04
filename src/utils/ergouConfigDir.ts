import { homedir } from 'os'
import { join } from 'path'

export function getErgouConfigDir(): string {
  return process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.ergou')
}

export function getErgouGlobalConfigFile(): string {
  return join(getErgouConfigDir(), '.claude.json')
}
