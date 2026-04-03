export interface InProcessTeammateTask {
  id: string;
  status: 'running' | 'completed' | 'failed';
}

export function createInProcessTeammateTask(id: string): InProcessTeammateTask {
  return { id, status: 'running' };
}

export async function runInProcessTeammateTask(task: InProcessTeammateTask): Promise<void> {
  // No-op for now
}
