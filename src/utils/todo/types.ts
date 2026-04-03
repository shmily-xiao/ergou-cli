export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}
export type TodoStatus = 'pending' | 'completed';
