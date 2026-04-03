#!/bin/bash

# 批量创建所有剩余的缺失模块

TARGET="/Users/shmily/workspace/ergou-cli/src"

echo "🔧 批量创建剩余缺失模块..."

# format.ts
cat > "$TARGET/utils/format.ts" << 'EOF'
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
EOF

# mcpOutputStorage.ts
cat > "$TARGET/utils/mcpOutputStorage.ts" << 'EOF'
export interface MCPOutputStorage {
  store(key: string, value: any): void;
  get(key: string): any;
  delete(key: string): void;
}

export function createMCPOutputStorage(): MCPOutputStorage {
  const storage = new Map<string, any>();
  return {
    store: (key, value) => storage.set(key, value),
    get: (key) => storage.get(key),
    delete: (key) => storage.delete(key),
  };
}

export const mcpOutputStorage = createMCPOutputStorage();
EOF

# debug.ts
cat > "$TARGET/utils/debug.ts" << 'EOF'
export function logForDebugging(...args: any[]): void {
  if (process.env.DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}

export function debugLog(message: string, data?: any): void {
  if (process.env.DEBUG) {
    console.log('[DEBUG]', message, data);
  }
}
EOF

# log.ts
cat > "$TARGET/utils/log.ts" << 'EOF'
export function logError(error: Error | string): void {
  console.error('[ERROR]', error);
}

export function logInfo(message: string): void {
  console.log('[INFO]', message);
}

export function logWarn(message: string): void {
  console.warn('[WARN]', message);
}
EOF

# permissions/permissions.ts
mkdir -p "$TARGET/utils/permissions"
cat > "$TARGET/utils/permissions/permissions.ts" << 'EOF'
export interface Permission {
  type: string;
  granted: boolean;
}

export function checkPermission(type: string): boolean {
  return true;
}

export function requestPermission(type: string): Promise<boolean> {
  return Promise.resolve(true);
}
EOF

# permissions/PermissionUpdate.ts
cat > "$TARGET/utils/permissions/PermissionUpdate.ts" << 'EOF'
export interface PermissionUpdate {
  type: string;
  granted: boolean;
  timestamp: Date;
}

export function createPermissionUpdate(type: string, granted: boolean): PermissionUpdate {
  return {
    type,
    granted,
    timestamp: new Date(),
  };
}
EOF

# permissions/PermissionMode.ts
cat > "$TARGET/utils/permissions/PermissionMode.ts" << 'EOF'
export type PermissionMode = 'auto' | 'ask' | 'deny';

export const DEFAULT_PERMISSION_MODE: PermissionMode = 'auto';

export function isValidPermissionMode(mode: string): mode is PermissionMode {
  return ['auto', 'ask', 'deny'].includes(mode);
}
EOF

# bridge/replBridgeHandle.ts
mkdir -p "$TARGET/bridge"
cat > "$TARGET/bridge/replBridgeHandle.ts" << 'EOF'
export interface REPLBridgeHandle {
  execute(command: string): Promise<string>;
  close(): void;
}

export function createREPLBridgeHandle(): REPLBridgeHandle {
  return {
    execute: async (command) => command,
    close: () => {},
  };
}
EOF

# slowOperations.ts
cat > "$TARGET/utils/slowOperations.ts" << 'EOF'
export function jsonStringify(obj: any, space?: number): string {
  return JSON.stringify(obj, null, space);
}

export function slowOperation<T>(fn: () => T): T {
  return fn();
}
EOF

# glob.ts
cat > "$TARGET/utils/glob.ts" << 'EOF'
import { glob as fastGlob } from 'fast-glob';

export async function glob(pattern: string, options?: any): Promise<string[]> {
  return await fastGlob(pattern, options);
}

export function globSync(pattern: string, options?: any): string[] {
  return fastGlob.sync(pattern, options);
}
EOF

# claudemd.ts
cat > "$TARGET/utils/claudemd.ts" << 'EOF'
export function isClaudeMdFile(path: string): boolean {
  return path.endsWith('.md') || path.endsWith('.mdx');
}

export function parseClaudeMd(content: string): any {
  return { content };
}
EOF

# promptCategory.ts
cat > "$TARGET/utils/promptCategory.ts" << 'EOF'
export type PromptCategory = 'general' | 'code' | 'debug' | 'test';

export function categorizePrompt(prompt: string): PromptCategory {
  if (prompt.includes('code') || prompt.includes('function')) return 'code';
  if (prompt.includes('bug') || prompt.includes('error')) return 'debug';
  if (prompt.includes('test')) return 'test';
  return 'general';
}
EOF

# tasks/InProcessTeammateTask
mkdir -p "$TARGET/tasks/InProcessTeammateTask"
cat > "$TARGET/tasks/InProcessTeammateTask/InProcessTeammateTask.ts" << 'EOF'
export interface InProcessTeammateTask {
  id: string;
  status: string;
}

export function createInProcessTeammateTask(id: string): InProcessTeammateTask {
  return { id, status: 'running' };
}
EOF

# envUtils.ts
cat > "$TARGET/utils/envUtils.ts" << 'EOF'
export function isEnvTruthy(value: string | undefined): boolean {
  return value === '1' || value === 'true' || value === 'yes';
}

export function getClaudeConfigHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || '.';
}
EOF

# toolSearch.ts
cat > "$TARGET/utils/toolSearch.ts" << 'EOF'
export interface ToolSearchResult {
  name: string;
  description: string;
  score: number;
}

export async function searchTools(query: string): Promise<ToolSearchResult[]> {
  return [];
}
EOF

# todo/types.ts
mkdir -p "$TARGET/utils/todo"
cat > "$TARGET/utils/todo/types.ts" << 'EOF'
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoStatus = 'pending' | 'completed';
EOF

# settings/settings.ts
mkdir -p "$TARGET/utils/settings"
cat > "$TARGET/utils/settings/settings.ts" << 'EOF'
export interface Settings {
  theme?: string;
  language?: string;
}

export async function loadSettings(): Promise<Settings> {
  return {};
}

export async function saveSettings(settings: Settings): Promise<void> {
  // No-op
}
EOF

# fileHistory.ts
cat > "$TARGET/utils/fileHistory.ts" << 'EOF'
export interface FileHistory {
  path: string;
  content: string;
  timestamp: Date;
}

export function recordFileHistory(path: string, content: string): void {
  // No-op for now
}

export function getFileHistory(path: string): FileHistory[] {
  return [];
}
EOF

# fileRead.ts
cat > "$TARGET/utils/fileRead.ts" << 'EOF'
import { readFile } from 'fs/promises';

export async function readFileSyncWithMetadata(path: string): Promise<{ content: string; size: number }> {
  const content = await readFile(path, 'utf-8');
  return { content, size: content.length };
}
EOF

# execFileNoThrow.ts
cat > "$TARGET/utils/execFileNoThrow.ts" << 'EOF'
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function execFileNoThrow(command: string, args?: string[]): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args);
    return { stdout, stderr, exitCode: 0 };
  } catch (error: any) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.code || 1,
    };
  }
}
EOF

echo "✅ 所有剩余缺失模块创建完成！"
