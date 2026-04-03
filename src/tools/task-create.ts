/**
 * TaskCreateTool - 简化版本
 */

export class TaskCreateTool {
  private tasks: Array<{ id: string; title: string; status: string }> = [];

  async execute(params: Record<string, unknown>): Promise<any> {
    const { title, description } = params as { title: string; description?: string };
    
    try {
      const id = `task-${Date.now()}`;
      this.tasks.push({ id, title, status: 'pending' });
      
      return {
        success: true,
        output: `任务已创建：${title}`,
        metadata: {
          id,
          title,
          description,
          status: 'pending',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
