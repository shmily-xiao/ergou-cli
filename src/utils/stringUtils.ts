/**
 * String Utils - 兼容层
 */

export function plural(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return `1 ${singular}`;
  }
  return `${count} ${plural || singular + 's'}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}
