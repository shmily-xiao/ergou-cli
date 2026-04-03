/**
 * ConfigTool - 简化版本
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

export class ConfigTool {
  private configPath = join(homedir(), '.ergou', 'config.json');

  async execute(params: Record<string, unknown>): Promise<any> {
    const { action, key, value } = params as {
      action: 'get' | 'set' | 'list';
      key?: string;
      value?: any;
    };

    try {
      const config = await this.loadConfig();

      if (action === 'list') {
        return {
          success: true,
          output: JSON.stringify(config, null, 2),
          metadata: config,
        };
      }

      if (action === 'get' && key) {
        const keys = key.split('.');
        let result: any = config;
        for (const k of keys) {
          result = result?.[k];
        }
        return {
          success: true,
          output: result !== undefined ? String(result) : 'Key not found',
          metadata: { key, value: result },
        };
      }

      if (action === 'set' && key && value !== undefined) {
        const keys = key.split('.');
        let current: any = config;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        await this.saveConfig(config);
        return {
          success: true,
          output: `配置已更新：${key} = ${JSON.stringify(value)}`,
          metadata: { key, value },
        };
      }

      return {
        success: false,
        error: '无效的操作或参数',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async loadConfig(): Promise<any> {
    try {
      const { readFile } = await import('fs/promises');
      const content = await readFile(this.configPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {
        defaultProvider: 'aliyun',
        defaultModel: 'glm-5',
        providers: {},
      };
    }
  }

  private async saveConfig(config: any): Promise<void> {
    const { writeFile, mkdir } = await import('fs/promises');
    const { dirname } = await import('path');
    await mkdir(dirname(this.configPath), { recursive: true });
    await writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
  }
}
