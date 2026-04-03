/**
 * GlobTool - 简化版本
 * 基于 claude-code-sourcemap 的 GlobTool 实现
 */

import { glob as fastGlob } from 'fast-glob';

export class GlobTool {
  async execute(params: Record<string, unknown>): Promise<any> {
    const { pattern, cwd = '.', onlyFiles = true, head_limit = 100 } = params as {
      pattern: string;
      cwd?: string;
      onlyFiles?: boolean;
      head_limit?: number;
    };

    try {
      const matches = await fastGlob(pattern, {
        cwd,
        onlyFiles,
        dot: true,
      });

      const limited = matches.slice(0, head_limit);

      return {
        success: true,
        output: limited.join('\n') || '未找到匹配文件',
        metadata: {
          pattern,
          cwd,
          totalMatches: matches.length,
          returnedMatches: limited.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
