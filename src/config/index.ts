/**
 * 配置系统 - 管理用户配置
 * 
 * 配置文件位置：~/.ergou/config.json
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

const CONFIG_DIR = join(homedir(), '.ergou');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export interface ErgouConfig {
  // 默认 Provider
  defaultProvider?: string;
  
  // 默认模型
  defaultModel?: string;
  
  // Provider API Keys
  providers?: {
    aliyun?: {
      apiKey?: string;
      baseUrl?: string;
    };
    anthropic?: {
      apiKey?: string;
      baseUrl?: string;
    };
    deepseek?: {
      apiKey?: string;
      baseUrl?: string;
    };
    openai?: {
      apiKey?: string;
      baseUrl?: string;
    };
  };
  
  // UI 配置
  ui?: {
    theme?: 'dark' | 'light';
    showTokenUsage?: boolean;
    showCost?: boolean;
  };
  
  // 工具配置
  tools?: {
    autoApprove?: string[]; // 自动批准的命令
    timeout?: number; // 默认超时 (ms)
  };
}

const defaultConfig: ErgouConfig = {
  defaultProvider: 'zhipu',
  defaultModel: 'glm-5',
  providers: {},
  ui: {
    theme: 'dark',
    showTokenUsage: true,
    showCost: true,
  },
  tools: {
    autoApprove: [],
    timeout: 30000,
  },
};

/**
 * 确保配置目录存在
 */
async function ensureConfigDir() {
  try {
    await mkdir(CONFIG_DIR, { recursive: true });
  } catch (error) {
    // 目录可能已存在
  }
}

/**
 * 读取配置
 */
export async function loadConfig(): Promise<ErgouConfig> {
  try {
    const content = await readFile(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(content);
    return { ...defaultConfig, ...config };
  } catch (error) {
    // 配置文件不存在或解析失败，返回默认配置
    return defaultConfig;
  }
}

/**
 * 保存配置
 */
export async function saveConfig(config: ErgouConfig): Promise<void> {
  await ensureConfigDir();
  const content = JSON.stringify(config, null, 2);
  await writeFile(CONFIG_FILE, content, 'utf-8');
}

/**
 * 获取某个 Provider 的配置
 */
export function getProviderConfig(config: ErgouConfig, providerName: string): any {
  return config.providers?.[providerName as keyof typeof config.providers] || {};
}

/**
 * 设置某个 Provider 的配置
 */
export function setProviderConfig(
  config: ErgouConfig,
  providerName: string,
  providerConfig: any
): ErgouConfig {
  return {
    ...config,
    providers: {
      ...config.providers,
      [providerName]: providerConfig,
    },
  };
}

/**
 * 从环境变量加载配置
 */
export function loadConfigFromEnv(): ErgouConfig {
  const config: ErgouConfig = { ...defaultConfig };
  
  // 智谱 GLM (默认)
  if (process.env.ZHIPU_API_KEY) {
    config.providers = {
      ...config.providers,
      zhipu: {
        apiKey: process.env.ZHIPU_API_KEY,
      },
    };
  }
  
  // 阿里云
  if (process.env.DASHSCOPE_API_KEY) {
    config.providers = {
      ...config.providers,
      aliyun: {
        apiKey: process.env.DASHSCOPE_API_KEY,
      },
    };
  }
  
  // Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    config.providers = {
      ...config.providers,
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY,
      },
    };
  }
  
  // DeepSeek
  if (process.env.DEEPSEEK_API_KEY) {
    config.providers = {
      ...config.providers,
      deepseek: {
        apiKey: process.env.DEEPSEEK_API_KEY,
      },
    };
  }
  
  // OpenAI
  if (process.env.OPENAI_API_KEY) {
    config.providers = {
      ...config.providers,
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    };
  }
  
  return config;
}

/**
 * 合并配置 (文件 + 环境变量)
 * 环境变量优先级更高
 */
export async function getMergedConfig(): Promise<ErgouConfig> {
  const fileConfig = await loadConfig();
  const envConfig = loadConfigFromEnv();
  
  // 合并配置，环境变量优先级更高
  return {
    ...fileConfig,
    ...envConfig,
    providers: {
      ...fileConfig.providers,
      ...envConfig.providers,
    },
  };
}
