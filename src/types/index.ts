/**
 * Ergou CLI - 核心类型定义
 * 基于 Claude Code restored-src 代码重构
 */

// ========== 基础消息类型 ==========

export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  content: string | ContentBlock[];
  name?: string;
}

export type ContentBlock = 
  | TextBlock
  | ImageBlock
  | ToolUseBlock
  | ToolResultBlock;

export interface TextBlock {
  type: 'text';
  text: string;
}

export interface ImageBlock {
  type: 'image';
  source: {
    type: 'base64' | 'url';
    media_type: string;
    data?: string;
    url?: string;
  };
}

export interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | ContentBlock[];
  is_error?: boolean;
}

// ========== Token 和成本 ==========

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  totalTokens?: number;
}

export interface CostInfo {
  currency: string;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
  cacheReadPerMillion?: number;
  cacheWritePerMillion?: number;
}

// ========== 模型信息 ==========

export interface ModelInfo {
  id: string;
  displayName: string;
  provider: string;
  contextWindow: number;
  maxOutputTokens?: number;
  supportsVision?: boolean;
  supportsFunctionCall?: boolean;
  supportsStreaming?: boolean;
  knowledgeCutoff?: string;
  pricing?: ModelPricing;
  capabilities?: ModelCapabilities;
}

export interface ModelCapabilities {
  codeGeneration?: boolean;
  codeAnalysis?: boolean;
  mathematicalReasoning?: boolean;
  creativeWriting?: boolean;
  multilingual?: boolean;
  longContext?: boolean;
}

// ========== 聊天选项 ==========

export interface ChatOptions {
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  system?: string;
  tools?: ToolDefinition[];
  toolChoice?: ToolChoice;
  stream?: boolean;
  metadata?: Record<string, string>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export type ToolChoice = 
  | 'auto'
  | 'required'
  | 'none'
  | { type: 'tool'; name: string };

// ========== 流式响应 ==========

export interface ChatChunk {
  type: 'content' | 'tool_use' | 'tool_result' | 'error' | 'done';
  content?: string;
  toolUseId?: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  error?: Error;
  usage?: TokenUsage;
  finishReason?: 'stop' | 'tool_use' | 'max_tokens' | 'error';
}

// ========== Provider 接口 ==========

export interface ProviderConfig {
  name: string;
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  headers?: Record<string, string>;
}

export interface ModelProvider {
  readonly name: string;
  readonly defaultModel: string;
  
  listModels(): Promise<ModelInfo[]>;
  validateModel(model: string): Promise<boolean>;
  chat(messages: Message[], options: ChatOptions): AsyncIterable<ChatChunk>;
  getCost(model: string, usage: TokenUsage): CostInfo;
  dispose?(): Promise<void>;
}

// ========== 工具系统 ==========

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute(params: Record<string, unknown>): Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  output?: string | Record<string, unknown>;
  error?: string;
  metadata?: Record<string, unknown>;
}

// ========== Agent 系统 ==========

export interface AgentConfig {
  name: string;
  model: string;
  systemPrompt?: string;
  tools?: string[];
  maxIterations?: number;
  temperature?: number;
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
}

// ========== 会话管理 ==========

export interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  config: SessionConfig;
  metadata: SessionMetadata;
}

export interface SessionConfig {
  model: string;
  provider: string;
  systemPrompt?: string;
  tools?: string[];
  maxTokens?: number;
}

export interface SessionMetadata {
  title?: string;
  tags?: string[];
  custom?: Record<string, unknown>;
}

// ========== 配置系统 ==========

export interface AppConfig {
  providers: ProviderConfig[];
  defaultProvider: string;
  defaultModel: string;
  tools: ToolConfig[];
  ui: UIConfig;
  telemetry: TelemetryConfig;
}

export interface ToolConfig {
  name: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface UIConfig {
  theme: 'light' | 'dark' | 'auto';
  showTokenUsage: boolean;
  showCost: boolean;
  codeHighlight: boolean;
}

export interface TelemetryConfig {
  enabled: boolean;
  endpoint?: string;
  sampleRate?: number;
}

// ========== 错误类型 ==========

export class ErgouError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'ErgouError';
  }
}

export class ProviderError extends ErgouError {
  constructor(
    message: string,
    public provider: string,
    cause?: unknown
  ) {
    super(message, 'PROVIDER_ERROR', cause);
    this.name = 'ProviderError';
  }
}

export class ModelNotFoundError extends ErgouError {
  constructor(
    public model: string,
    public provider: string
  ) {
    super(`Model '${model}' not found for provider '${provider}'`, 'MODEL_NOT_FOUND');
    this.name = 'ModelNotFoundError';
  }
}

export class ToolExecutionError extends ErgouError {
  constructor(
    public toolName: string,
    message: string,
    cause?: unknown
  ) {
    super(message, 'TOOL_EXECUTION_ERROR', cause);
    this.name = 'ToolExecutionError';
  }
}
