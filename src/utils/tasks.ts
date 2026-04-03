export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
export async function loadTasks(): Promise<Task[]> { return []; }
export async function saveTask(task: Task): Promise<void> {}
export async function deleteTask(id: string): Promise<void> {}
export async function listTasks(): Promise<Task[]> { return []; }
export async function getTask(id: string): Promise<Task | null> { return null; }
