/**
 * Lazy Schema - 兼容层
 */

import type { z } from 'zod';

export function lazySchema<T extends z.ZodType>(factory: () => T): z.ZodLazy<T> {
  return z.lazy(factory);
}
