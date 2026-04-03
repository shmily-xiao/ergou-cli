import { createHash, randomBytes } from 'crypto';

export function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function md5(data: string): string {
  return createHash('md5').update(data).digest('hex');
}

export function generateRandomId(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function generateToken(): string {
  return generateRandomId(24);
}
