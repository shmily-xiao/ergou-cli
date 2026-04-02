/**
 * Bash 工具 - Shell 命令执行
 */

import { execa } from 'execa';
import type { Tool, ToolResult } from '@/types';

export class BashTool implements Tool {
  name = 'bash';
  description = '执行 Shell 命令';
  inputSchema = {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: '要执行的 Shell 命令',
      },
      cwd: {
        type: 'string',
        description: '工作目录',
      },
      timeout: {
        type: 'number',
        description: '超时时间（毫秒）',
        default: 30000,
      },
    },
    required: ['command'],
  };

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const { command, cwd, timeout = 30000 } = params as {
      command: string;
      cwd?: string;
      timeout?: number;
    };

    try {
      const result = await execa(command, {
        shell: true,
        cwd: cwd || process.cwd(),
        timeout,
      });

      return {
        success: true,
        output: result.stdout || result.stderr,
        metadata: {
          exitCode: result.exitCode,
          command,
          cwd: cwd || process.cwd(),
        },
      };
    } catch (error) {
      const execError = error as {
        message: string;
        stdout?: string;
        stderr?: string;
        exitCode?: number;
      };

      return {
        success: false,
        error: execError.message,
        output: execError.stdout || execError.stderr,
        metadata: {
          exitCode: execError.exitCode,
          command,
        },
      };
    }
  }
}
