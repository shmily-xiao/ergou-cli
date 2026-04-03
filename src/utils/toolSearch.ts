export interface ToolSearchResult {
  name: string;
  description: string;
  score: number;
}
export async function searchTools(query: string): Promise<ToolSearchResult[]> {
  return [];
}
