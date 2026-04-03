#!/bin/bash

# 批量创建缺失的模块

TARGET="/Users/shmily/workspace/ergou-cli/src"

echo "🔧 批量创建缺失模块..."

# cronTasks.ts
cat > "$TARGET/utils/cronTasks.ts" << 'EOF'
export interface CronTask {
  id: string;
  expression: string;
  command: string;
  enabled: boolean;
}

export async function loadCronTasks(): Promise<CronTask[]> {
  return [];
}

export async function saveCronTasks(tasks: CronTask[]): Promise<void> {
  // No-op for now
}

export async function deleteCronTask(id: string): Promise<void> {
  // No-op for now
}

export async function listCronTasks(): Promise<CronTask[]> {
  return [];
}
EOF

# teammateContext.ts
cat > "$TARGET/utils/teammateContext.ts" << 'EOF'
export interface TeammateContext {
  id: string;
  name: string;
  email?: string;
}

export function getTeammateContext(): TeammateContext | null {
  return null;
}

export function isTeammateMode(): boolean {
  return false;
}
EOF

# hooks.ts
cat > "$TARGET/utils/hooks.ts" << 'EOF'
export interface HookContext {
  event: string;
  data: any;
}

export async function triggerHook(event: string, data: any): Promise<void> {
  // No-op for now
}

export function registerHook(event: string, handler: (data: any) => void): void {
  // No-op for now
}
EOF

# tasks.ts
cat > "$TARGET/utils/tasks.ts" << 'EOF'
export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export async function loadTasks(): Promise<Task[]> {
  return [];
}

export async function saveTask(task: Task): Promise<void> {
  // No-op for now
}

export async function deleteTask(id: string): Promise<void> {
  // No-op for now
}

export async function listTasks(): Promise<Task[]> {
  return [];
}

export async function getTask(id: string): Promise<Task | null> {
  return null;
}
EOF

# terminal.ts
cat > "$TARGET/utils/terminal.ts" << 'EOF'
export function isOutputLineTruncated(line: string): boolean {
  return line.endsWith('...') || line.length > 1000;
}

export function truncateOutput(output: string, maxLength: number = 10000): string {
  if (output.length <= maxLength) {
    return output;
  }
  return output.substring(0, maxLength) + '...\n[truncated]';
}
EOF

# diagnosticTracking.ts
cat > "$TARGET/services/diagnosticTracking.ts" << 'EOF'
export const diagnosticTracker = {
  trackError: (error: Error) => {
    console.error('[Diagnostic]', error);
  },
  trackEvent: (event: string, data?: any) => {
    // No-op for now
  },
  trackToolUse: (tool: string, duration?: number) => {
    // No-op for now
  },
};
EOF

# stopTask.ts
mkdir -p "$TARGET/tasks"
cat > "$TARGET/tasks/stopTask.ts" << 'EOF'
export async function stopTask(taskId: string): Promise<void> {
  // No-op for now
  console.log(`Stopping task: ${taskId}`);
}
EOF

# FallbackToolUseRejectedMessage.tsx
cat > "$TARGET/components/FallbackToolUseRejectedMessage.tsx" << 'EOF'
export function FallbackToolUseRejectedMessage({ tool, reason }: { tool: string; reason?: string }) {
  return `Tool ${tool} was rejected${reason ? ': ' + reason : ''}`;
}
EOF

echo "✅ 缺失模块创建完成！"
