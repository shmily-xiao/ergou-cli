/**
 * Shell Rule Matching - 兼容层
 */

import picomatch from 'picomatch';

export function matchWildcardPattern(pattern: string, path: string): boolean {
  const isMatch = picomatch(pattern, { dot: true });
  return isMatch(path);
}

export function matchPatterns(patterns: string[], path: string): boolean {
  return patterns.some(pattern => matchWildcardPattern(pattern, path));
}

export function excludePatterns(patterns: string[], path: string): boolean {
  return !matchPatterns(patterns, path);
}
