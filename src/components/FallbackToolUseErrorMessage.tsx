// 占位组件
export function FallbackToolUseErrorMessage({ error }: { error?: string }) {
  return error || 'Unknown error';
}
