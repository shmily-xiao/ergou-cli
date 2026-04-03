/**
 * WebFetchTool - 简化版本
 */
import { fetch } from 'undici';

export class WebFetchTool {
  async execute(params: Record<string, unknown>): Promise<any> {
    const { url } = params as { url: string };
    
    try {
      const response = await fetch(url);
      const text = await response.text();
      
      return {
        success: true,
        output: `成功获取网页内容 (${text.length} 字符)`,
        metadata: {
          url,
          title: text.match(/<title>(.*?)<\/title>/i)?.[1] || 'Unknown',
          content: text.substring(0, 1000) + '...',
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
