/**
 * GrepTool - 简化版本
 * 基于 claude-code-sourcemap 的 GrepTool 实现
 */

import { execa } from 'execa';

export class GrepTool {
  async execute(params: Record<string, unknown>): Promise<any> {
    const { pattern, path = '.', '-i': caseInsensitive, '-n': lineNumbers, head_limit = 100 } = params as {
      pattern: string;
      path?: string;
      '-i'?: boolean;
      '-n'?: boolean;
      head_limit?: number;
    };

    try {
      // 优先使用 ripgrep
      const useRipgrep = await this.checkRipgrep();
      
      if (useRipgrep) {
        return await this.executeWithRipgrep(pattern, path, caseInsensitive, lineNumbers, head_limit);
      } else {
        return await this.executeWithGrep(pattern, path, caseInsensitive, lineNumbers, head_limit);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async checkRipgrep(): Promise<boolean> {
    try {
      await execa('rg', ['--version']);
      return true;
    } catch {
      return false;
    }
  }

  private async executeWithRipgrep(
    pattern: string,
    path: string,
    caseInsensitive?: boolean,
    lineNumbers?: boolean,
    headLimit?: number
  ): Promise<any> {
    const args: string[] = ['--json', '--no-heading'];
    
    if (caseInsensitive) args.push('-i');
    if (lineNumbers !== false) args.push('-n');
    args.push(pattern, path);

    const result = await execa('rg', args, {
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const lines = result.stdout.split('\n').filter(line => line.trim());
    const matches = lines.slice(0, headLimit).map(line => {
      try {
        const json = JSON.parse(line);
        if (json.type === 'match') {
          return `${json.data.path.text}:${json.data.line_number}:${json.data.lines.text}`;
        }
        return line;
      } catch {
        return line;
      }
    });

    return {
      success: true,
      output: matches.join('\n') || '未找到匹配结果',
      metadata: {
        pattern,
        path,
        tool: 'ripgrep',
        matchCount: matches.length,
      },
    };
  }

  private async executeWithGrep(
    pattern: string,
    path: string,
    caseInsensitive?: boolean,
    lineNumbers?: boolean,
    headLimit?: number
  ): Promise<any> {
    const args: string[] = ['-r', '--include=*'];
    
    if (caseInsensitive) args.push('-i');
    if (lineNumbers !== false) args.push('-n');
    args.push(pattern, path);

    const result = await execa('grep', args, {
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const lines = result.stdout.split('\n').filter(line => line.trim());
    const output = lines.slice(0, headLimit).join('\n') || '未找到匹配结果';

    return {
      success: true,
      output,
      metadata: {
        pattern,
        path,
        tool: 'grep',
        matchCount: lines.length,
      },
    };
  }
}
