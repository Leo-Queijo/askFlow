export type TaskStatus =
  | 'pendente'
  | 'em_andamento'
  | 'concluida';

export type TaskPriority =
  | 'baixa'
  | 'media'
  | 'alta';

export type TaskCategory =
  | 'pessoal'
  | 'estudos'
  | 'trabalho'
  | 'saude'
  | 'outros';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: string;
  updatedAt: string;
}

export type TaskInput = Omit<
  Task,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export type TaskStatusFilter = 'todas' | TaskStatus;