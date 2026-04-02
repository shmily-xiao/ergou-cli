/**
 * 文件写入工具
 */

import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import type { Tool, ToolResult } from '@/types';

export class FileWriteTool implements Tool {
  name = 'file_write';
  description = '写入文件内容';
  inputSchema = {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: '文件路径',
      },
      content: {
        type: 'string',
        description: '文件内容',
      },
      encoding: {
        type: 'string',
        description: '编码格式',
        default: 'utf-8',
      },
    },
    required: ['path', 'content'],
  };

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const { path, content, encoding = 'utf-8' } = params as {
      path: string;
      content: string;
      encoding?: string;
    };

    try {
      // 确保目录存在
      const dir = dirname(path);
      await mkdir(dir, { recursive: true });

      await writeFile(path, content, { encoding: encoding as BufferEncoding });

      return {
        success: true,
        output: `文件已写入：${path}`,
        metadata: {
          path,
          encoding,
          size: content.length,
        },
      };
    } catch (error) {
      const writeError = error as { code: string; message: string };

      return {
        success: false,
        error: writeError.message,
        metadata: {
          path,
          code: writeError.code,
        },
      };
    }
  }
}
