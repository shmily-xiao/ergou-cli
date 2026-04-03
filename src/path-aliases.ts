/**
 * 导入路径别名配置
 * 将 claude-code-sourcemap 的导入路径映射到 ergou-cli
 */

// @ts-ignore
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 路径映射表
export const PATH_ALIASES: Record<string, string> = {
  // 核心模块
  '../../Tool.js': '../Tool.js',
  '../../types/index.js': '../types/index.js',
  '../../utils/': '../utils/',
  '../../constants/': '../constants/',
  '../../services/': '../services/',
  '../../components/': '../components/',
  '../../context/': '../context/',
  '../../state/': '../state/',
  '../../hooks/': '../hooks/',
  '../../ink.js': '../ink.js',
  
  // 工具模块
  '../BashTool/': '../tools-full/BashTool/',
  '../FileReadTool/': '../tools-full/FileReadTool/',
  '../FileWriteTool/': '../tools-full/FileWriteTool/',
  '../FileEditTool/': '../tools-full/FileEditTool/',
  '../GrepTool/': '../tools-full/GrepTool/',
  '../GlobTool/': '../tools-full/GlobTool/',
  '../MCPTool/': '../tools-full/MCPTool/',
  '../LSPTool/': '../tools-full/LSPTool/',
  '../AgentTool/': '../tools-full/AgentTool/',
  
  // 相对路径标准化
  './': '../',
};

/**
 * 转换导入路径
 */
export function transformImportPath(importPath: string, fromFile: string): string {
  // 已经是绝对路径或外部模块
  if (importPath.startsWith('/') || !importPath.startsWith('.')) {
    return importPath;
  }
  
  // 应用路径映射
  for (const [from, to] of Object.entries(PATH_ALIASES)) {
    if (importPath.startsWith(from)) {
      return importPath.replace(from, to);
    }
  }
  
  return importPath;
}
