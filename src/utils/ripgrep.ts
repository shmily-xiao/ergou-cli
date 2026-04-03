/**
 * RipGrep - 兼容层
 */

import { execa } from 'execa';

export interface RipGrepOptions {
  pattern: string;
  path?: string;
  glob?: string;
  '-i'?: boolean;
  '-n'?: boolean;
  '-C'?: number;
  '-B'?: number;
  '-A'?: number;
  type?: string;
  head_limit?: number;
  offset?: number;
  multiline?: boolean;
}

export interface RipGrepResult {
  success: boolean;
  matches: Array<{
    path: string;
    line: number;
    content: string;
  }>;
  count?: number;
}

export async function ripGrep(options: RipGrepOptions): Promise<RipGrepResult> {
  const args: string[] = ['--json', '--no-heading'];
  
  if (options['-i']) args.push('-i');
  if (options['-n']) args.push('-n');
  if (options['-C']) args.push('-C', options['-C'].toString());
  if (options['-B']) args.push('-B', options['-B'].toString());
  if (options['-A']) args.push('-A', options['-A'].toString());
  if (options.type) args.push('--type', options.type);
  if (options.glob) args.push('--glob', options.glob);
  if (options.multiline) args.push('-U', '--multiline-dotall');
  
  args.push(options.pattern, options.path || '.');
  
  try {
    const result = await execa('rg', args, {
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
    });
    
    const lines = result.stdout.split('\n').filter(line => line.trim());
    const matches = lines.map(line => {
      try {
        const json = JSON.parse(line);
        if (json.type === 'match') {
          return {
            path: json.data.path.text,
            line: json.data.line_number,
            content: json.data.lines.text,
          };
        }
      } catch {
        // Ignore parse errors
      }
      return null;
    }).filter(Boolean) as Array<{ path: string; line: number; content: string }>;
    
    if (options.head_limit) {
      matches.splice(options.head_limit);
    }
    
    return {
      success: true,
      matches,
      count: matches.length,
    };
  } catch (error) {
    const rgError = error as { exitCode?: number };
    if (rgError.exitCode === 1) {
      // No matches found
      return { success: true, matches: [], count: 0 };
    }
    throw error;
  }
}
