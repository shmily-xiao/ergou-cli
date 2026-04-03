/**
 * FileEditTool - 简化版本
 * 基于 claude-code-sourcemap 的 FileEditTool 实现
 * 支持 diff 模式编辑文件
 */

import { readFile, writeFile } from 'fs/promises';
import { execa } from 'execa';

export class FileEditTool {
  async execute(params: Record<string, unknown>): Promise<any> {
    const { path, diff, old_text, new_text } = params as {
      path: string;
      diff?: string;
      old_text?: string;
      new_text?: string;
    };

    try {
      // 读取原文件
      const originalContent = await readFile(path, 'utf-8');
      
      let newContent: string;
      
      // 支持两种编辑模式
      if (diff) {
        // 模式 1: 使用统一 diff
        newContent = await this.applyDiff(originalContent, diff);
      } else if (old_text && new_text) {
        // 模式 2: 直接替换文本
        newContent = originalContent.replace(old_text, new_text);
      } else {
        return {
          success: false,
          error: '需要提供 diff 或 old_text/new_text 参数',
        };
      }
      
      // 写入新内容
      await writeFile(path, newContent, 'utf-8');
      
      // 计算变更统计
      const stats = await this.calculateDiffStats(originalContent, newContent);
      
      return {
        success: true,
        output: `文件已更新：${path}`,
        metadata: {
          path,
          originalSize: originalContent.length,
          newSize: newContent.length,
          ...stats,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async applyDiff(originalContent: string, diff: string): Promise<string> {
    try {
      // 尝试使用 patch 命令
      const tempOriginal = `/tmp/original-${Date.now()}.txt`;
      const tempPatch = `/tmp/patch-${Date.now()}.diff`;
      const tempResult = `/tmp/result-${Date.now()}.txt`;
      
      const { writeFile } = await import('fs/promises');
      await writeFile(tempOriginal, originalContent);
      await writeFile(tempPatch, diff);
      
      await execa('patch', [tempOriginal, '-i', tempPatch, '-o', tempResult]);
      
      const { readFile } = await import('fs/promises');
      const result = await readFile(tempResult, 'utf-8');
      
      // 清理临时文件
      const { unlink } = await import('fs/promises');
      await unlink(tempOriginal).catch(() => {});
      await unlink(tempPatch).catch(() => {});
      await unlink(tempResult).catch(() => {});
      
      return result;
    } catch (error) {
      // 如果 patch 不可用，回退到简单替换
      if (error instanceof Error && error.message.includes('diff')) {
        return this.applySimpleDiff(originalContent, diff);
      }
      throw error;
    }
  }

  private applySimpleDiff(originalContent: string, diff: string): string {
    // 简单的行级 diff 应用
    const lines = originalContent.split('\n');
    const diffLines = diff.split('\n');
    
    for (const line of diffLines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        // 添加行
        const content = line.substring(1);
        lines.push(content);
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        // 删除行
        const content = line.substring(1);
        const index = lines.indexOf(content);
        if (index !== -1) {
          lines.splice(index, 1);
        }
      }
    }
    
    return lines.join('\n');
  }

  private async calculateDiffStats(original: string, modified: string): Promise<any> {
    const originalLines = original.split('\n').length;
    const modifiedLines = modified.split('\n').length;
    
    // 简单的变更检测
    const addedLines = Math.max(0, modifiedLines - originalLines);
    const removedLines = Math.max(0, originalLines - modifiedLines);
    
    return {
      linesAdded: addedLines,
      linesRemoved: removedLines,
      linesChanged: addedLines + removedLines,
    };
  }
}
