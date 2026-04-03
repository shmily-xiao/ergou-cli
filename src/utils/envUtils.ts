export function isEnvTruthy(value: string | undefined): boolean {
  return value === '1' || value === 'true' || value === 'yes';
}
export function getClaudeConfigHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || '.';
}
