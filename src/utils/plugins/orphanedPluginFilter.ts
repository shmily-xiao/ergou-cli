/**
 * Plugins - Orphaned Plugin Filter - 兼容层
 */

export function getGlobExclusionsForPluginCache(): string[] {
  return [
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '*.log',
    '.DS_Store',
  ];
}
