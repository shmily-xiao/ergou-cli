export function isOutputLineTruncated(line: string): boolean {
  return line.endsWith('...') || line.length > 1000;
}

export function truncateOutput(output: string, maxLength: number = 10000): string {
  if (output.length <= maxLength) return output;
  return output.substring(0, maxLength) + '...\n[truncated]';
}
