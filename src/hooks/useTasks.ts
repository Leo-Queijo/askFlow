import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      'useTasks deve ser utilizado dentro de TaskProvider.',
    );
  }

  return context;
}