export interface FileHistory {
  path: string;
  content: string;
  timestamp: Date;
}

export function recordFileHistory(path: string, content: string): void {}
export function getFileHistory(path: string): FileHistory[] { return []; }
