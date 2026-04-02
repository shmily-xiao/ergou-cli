/**
 * 文件读取工具
 */

import { readFile } from 'fs/promises';
import type { Tool, ToolResult } from '@/types';

export class FileReadTool implements Tool {
  name = 'file_read';
  description = '读取文件内容';
  inputSchema = {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: '文件路径',
      },
      encoding: {
        type: 'string',
        description: '编码格式',
        default: 'utf-8',
      },
    },
    required: ['path'],
  };

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const { path, encoding = 'utf-8' } = params as {
      path: string;
      encoding?: string;
    };

    try {
      const content = await readFile(path, { encoding: encoding as BufferEncoding });

      return {
        success: true,
        output: content,
        metadata: {
          path,
          encoding,
          size: content.length,
        },
      };
    } catch (error) {
      const readError = error as { code: string; message: string };

      return {
        success: false,
        error: readError.message,
        metadata: {
          path,
          code: readError.code,
        },
      };
    }
  }
}
