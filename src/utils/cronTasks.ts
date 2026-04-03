export interface CronTask {
  id: string;
  expression: string;
  command: string;
  enabled: boolean;
}
export async function loadCronTasks(): Promise<CronTask[]> { return []; }
export async function saveCronTasks(tasks: CronTask[]): Promise<void> {}
export async function deleteCronTask(id: string): Promise<void> {}
export async function listCronTasks(): Promise<CronTask[]> { return []; }
