export function isClaudeMdFile(path: string): boolean {
  return path.endsWith('.md') || path.endsWith('.mdx');
}
export function parseClaudeMd(content: string): any {
  return { content };
}
