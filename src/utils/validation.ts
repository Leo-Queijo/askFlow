import {
    TaskCategory,
    TaskInput,
    TaskPriority,
    TaskStatus,
} from '../types/task';

const validStatuses: TaskStatus[] = [
  'pendente',
  'em_andamento',
  'concluida',
];

const validPriorities: TaskPriority[] = [
  'baixa',
  'media',
  'alta',
];

const validCategories: TaskCategory[] = [
  'pessoal',
  'estudos',
  'trabalho',
  'saude',
  'outros',
];

export function validateTask(task: TaskInput): string[] {
  const errors: string[] = [];

  if (!task.title || !task.title.trim()) {
    errors.push('O título é obrigatório.');
  } else if (task.title.trim().length < 3) {
    errors.push('O título deve ter pelo menos 3 caracteres.');
  }

  if (!task.description || !task.description.trim()) {
    errors.push('A descrição é obrigatória.');
  } else if (task.description.trim().length < 5) {
    errors.push(
      'A descrição deve ter pelo menos 5 caracteres.',
    );
  }

  if (!validStatuses.includes(task.status)) {
    errors.push('O status informado é inválido.');
  }

  if (!validPriorities.includes(task.priority)) {
    errors.push('A prioridade informada é inválida.');
  }

  if (!validCategories.includes(task.category)) {
    errors.push('A categoria informada é inválida.');
  }

  return errors;
}