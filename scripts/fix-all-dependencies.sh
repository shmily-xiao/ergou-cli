#!/bin/bash

# 系统性解决所有依赖问题
# 目标：启用所有 45 个工具，100% 可用

set -e

SOURCE="/Users/shmily/workspace/claude-code-sourcemap-main/restored-src"
TARGET="/Users/shmily/workspace/ergou-cli/src"

echo "🔧 开始系统性解决依赖问题..."
echo ""

# ========== 创建缺失的 utils ==========
echo "📦 创建缺失的 utils 模块..."

# crypto.ts
cat > "$TARGET/utils/crypto.ts" << 'EOF'
import { createHash, randomBytes } from 'crypto';

export function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function md5(data: string): string {
  return createHash('md5').update(data).digest('hex');
}

export function generateRandomId(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function generateToken(): string {
  return generateRandomId(24);
}
EOF

# settings/settingsCache.ts
mkdir -p "$TARGET/utils/settings"
cat > "$TARGET/utils/settings/settingsCache.ts" << 'EOF'
export interface SettingsCache {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
}

export function createSettingsCache(): SettingsCache {
  const cache = new Map<string, unknown>();
  
  return {
    get: (key) => cache.get(key) as any,
    set: (key, value) => cache.set(key, value),
    has: (key) => cache.has(key),
    delete: (key) => cache.delete(key),
    clear: () => cache.clear(),
  };
}

export const settingsCache = createSettingsCache();
EOF

# signal.ts
cat > "$TARGET/utils/signal.ts" << 'EOF'
export type SignalListener<T> = (value: T) => void;

export class Signal<T> {
  private listeners: Set<SignalListener<T>> = new Set();
  private _value: T | undefined;

  constructor(initialValue?: T) {
    this._value = initialValue;
  }

  get value(): T | undefined {
    return this._value;
  }

  set value(newValue: T | undefined) {
    this._value = newValue;
    this.notify();
  }

  subscribe(listener: SignalListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(): void {
    this.listeners.forEach(listener => listener(this._value as T));
  }
}

export function createSignal<T>(initialValue?: T): Signal<T> {
  return new Signal(initialValue);
}
EOF

# config.ts
cat > "$TARGET/utils/config.ts" << 'EOF'
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
EOF

echo "✅ Utils 模块创建完成"
echo ""

# ========== 创建缺失的 services ==========
echo "📦 创建缺失的 services 模块..."

# tokenEstimation.ts
cat > "$TARGET/services/tokenEstimation.ts" << 'EOF'
export function estimateTokens(text: string): number {
  // 简单估算：每 4 个字符约 1 个 token
  return Math.ceil(text.length / 4);
}

export function estimateMessagesTokens(messages: any[]): number {
  return messages.reduce((sum, msg) => {
    const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
    return sum + estimateTokens(content);
  }, 0);
}

export function createTokenEstimator() {
  return {
    estimate: estimateTokens,
    estimateMessages: estimateMessagesTokens,
  };
}
EOF

# sessionTranscript/sessionTranscript.ts
mkdir -p "$TARGET/sessionTranscript"
cat > "$TARGET/sessionTranscript/sessionTranscript.ts" << 'EOF'
export interface SessionTranscript {
  id: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
}

export function createSessionTranscript(id: string): SessionTranscript {
  return {
    id,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function addMessage(transcript: SessionTranscript, message: any): void {
  transcript.messages.push(message);
  transcript.updatedAt = new Date();
}
EOF

echo "✅ Services 模块创建完成"
echo ""

# ========== 创建缺失的 constants ==========
echo "📦 创建缺失的 constants 模块..."

# toolLimits.ts
cat > "$TARGET/constants/toolLimits.ts" << 'EOF'
export const TOOL_SUMMARY_MAX_LENGTH = 500;
export const TOOL_RESULT_MAX_LENGTH = 100000;
export const TOOL_OUTPUT_MAX_LENGTH = 50000;
EOF

# product.ts
cat > "$TARGET/constants/product.ts" << 'EOF'
export const PRODUCT_NAME = 'Ergou CLI';
export const PRODUCT_VERSION = '0.2.0';
export const PRODUCT_DISPLAY_NAME = 'Ergou';
EOF

echo "✅ Constants 模块创建完成"
echo ""

# ========== 创建缺失的 components (占位) ==========
echo "📦 创建缺失的 components 模块..."

cat > "$TARGET/components/CtrlOToExpand.tsx" << 'EOF'
export function CtrlOToExpand() { return null; }
EOF

cat > "$TARGET/components/FallbackToolUseErrorMessage.tsx" << 'EOF'
export function FallbackToolUseErrorMessage({ error }: { error?: string }) {
  return error || 'Unknown error';
}
EOF

cat > "$TARGET/components/MessageResponse.tsx" << 'EOF'
export function MessageResponse() { return null; }
EOF

cat > "$TARGET/components/Spinner.tsx" << 'EOF'
export function Spinner({ mode }: { mode?: string }) { return null; }
EOF

cat > "$TARGET/components/ToolUseMessage.tsx" << 'EOF'
export function ToolUseMessage({ tool, input }: { tool: string; input: any }) { return null; }
EOF

echo "✅ Components 模块创建完成"
echo ""

# ========== 创建缺失的 types ==========
echo "📦 创建缺失的 types 模块..."

# hooks.ts
cat > "$TARGET/types/hooks.ts" << 'EOF'
export interface HookProgress {
  type: string;
  data: any;
}

export interface PromptRequest {
  type: string;
  data: any;
}

export interface PromptResponse {
  type: string;
  data: any;
}
EOF

# logs.ts
cat > "$TARGET/types/logs.ts" << 'EOF'
export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
}
EOF

echo "✅ Types 模块创建完成"
echo ""

# ========== 统计 ==========
echo "========================="
echo "📊 创建统计:"
echo "  Utils: $(find "$TARGET/utils" -name '*.ts' | wc -l | tr -d ' ')"
echo "  Services: $(find "$TARGET/services" -type d | wc -l | tr -d ' ')"
echo "  Components: $(find "$TARGET/components" -name '*.tsx' | wc -l | tr -d ' ')"
echo "  Constants: $(find "$TARGET/constants" -name '*.ts' | wc -l | tr -d ' ')"
echo ""
echo "✅ 所有缺失模块创建完成！"
echo ""
echo "🚀 现在可以尝试构建并启用所有工具..."
