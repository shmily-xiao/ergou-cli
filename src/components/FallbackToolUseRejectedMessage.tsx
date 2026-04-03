export function FallbackToolUseRejectedMessage({ tool, reason }: { tool: string; reason?: string }) {
  return `Tool ${tool} was rejected${reason ? ': ' + reason : ''}`;
}
