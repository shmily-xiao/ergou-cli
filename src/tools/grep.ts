/**
 * GrepTool - 代码搜索工具
 * 简化版本，基于 ripgrep 或原生 grep
 */

import { execa } from 'execa';
import type { Tool, ToolResult } from '@/types';

export class GrepTool implements Tool {
  name = 'grep';
  description = '在文件中搜索文本内容 (类似 grep/ripgrep)';
  
  inputSchema = {
    type: 'object',
    properties: {
      pattern: {
        type: 'string',
        description: '要搜索的正则表达式模式',
      },
      path: {
        type: 'string',
        description: '搜索的文件或目录路径，默认为当前目录',
        default: '.',
      },
      glob: {
        type: 'string',
        description: 'Glob 模式过滤文件 (e.g. "*.js", "*.{ts,tsx}")',
      },
      '-i': {
        type: 'boolean',
        description: '不区分大小写搜索',
        default: false,
      },
      '-n': {
        type: 'boolean',
        description: '显示行号',
        default: true,
      },
      '-C': {
        type: 'number',
        description: '显示匹配行上下文的行数',
        default: 0,
      },
      head_limit: {
        type: 'number',
        description: '限制输出行数，默认 100',
        default: 100,
      },
    },
    required: ['pattern'],
  };

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const {
      pattern,
      path = '.',
      glob,
      '-i': caseInsensitive = false,
      '-n': lineNumbers = true,
      '-C': context = 0,
      head_limit = 100,
    } = params as {
      pattern: string;
      path?: string;
      glob?: string;
      '-i'?: boolean;
      '-n'?: boolean;
      '-C'?: number;
      head_limit?: number;
    };

    try {
      // 尝试使用 ripgrep (更快)
      const useRipgrep = await this.checkRipgrep();
      
      const args: string[] = [];
      
      if (useRipgrep) {
        args.push('--json', '--no-heading');
        if (caseInsensitive) args.push('-i');
        if (lineNumbers) args.push('-n');
        if (context > 0) args.push('-C', context.toString());
        if (glob) args.push('--glob', glob);
        args.push(pattern, path);
        
        const result = await execa('rg', args, {
          timeout: 30000,
          maxBuffer: 10 * 1024 * 1024, // 10MB
        });
        
        // 解析 ripgrep JSON 输出
        const lines = result.stdout.split('\n').filter(line => line.trim());
        const formattedOutput = lines
          .slice(0, head_limit)
          .map(line => {
            try {
              const json = JSON.parse(line);
              if (json.type === 'match') {
                return `${json.data.path.text}:${json.data.line_number}:${json.data.lines.text}`;
              }
              return line;
            } catch {
              return line;
            }
          })
          .join('\n');
        
        return {
          success: true,
          output: formattedOutput || '未找到匹配结果',
          metadata: {
            pattern,
            path,
            tool: 'ripgrep',
            matchCount: lines.length,
          },
        };
      } else {
        // 使用原生 grep
        args.push('-r', '--include=*'); // 递归搜索
        if (caseInsensitive) args.push('-i');
        if (lineNumbers) args.push('-n');
        if (context > 0) args.push('-C', context.toString());
        if (glob) {
          args.push('--include', glob);
        }
        args.push(pattern, path);
        
        const result = await execa('grep', args, {
          timeout: 30000,
          maxBuffer: 10 * 1024 * 1024,
        });
        
        const lines = result.stdout.split('\n').filter(line => line.trim());
        return {
          success: true,
          output: lines.slice(0, head_limit).join('\n') || '未找到匹配结果',
          metadata: {
            pattern,
            path,
            glob,
            tool: 'grep',
            matchCount: lines.length,
          },
        };
      }
    } catch (error) {
      const grepError = error as {
        message: string;
        stdout?: string;
        stderr?: string;
        exitCode?: number;
      };
      
      // grep/rg 返回 1 表示未找到匹配，不是错误
      if (grepError.exitCode === 1) {
        return {
          success: true,
          output: '未找到匹配结果',
          metadata: {
            pattern,
            path,
            matchCount: 0,
          },
        };
      }
      
      return {
        success: false,
        error: grepError.message,
        output: grepError.stdout || grepError.stderr,
        metadata: {
          pattern,
          path,
        },
      };
    }
  }

  /**
   * 检查是否安装了 ripgrep
   */
  private async checkRipgrep(): Promise<boolean> {
    try {
      await execa('rg', ['--version']);
      return true;
    } catch {
      return false;
    }
  }
}
