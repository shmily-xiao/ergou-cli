/**
 * Semantic Number - 兼容层
 */

import type { z } from 'zod';

export function semanticNumber<T extends z.ZodType>(schema: T): T {
  // Pass through for now, could add semantic validation later
  return schema;
}
