import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { useAuth } from '../hooks/useAuth';

import {
    Task,
    TaskInput,
    TaskStatusFilter,
} from '../types/task';

import {
    getTasks as loadTasks,
    saveTasks,
} from '../services/taskStorage';

import { generateId } from '../utils/generateID';
import { validateTask } from '../utils/validation';

interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  addTask: (input: TaskInput) => Promise<Task>;
  updateTask: (
    id: string,
    input: TaskInput,
  ) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;

  getTaskById: (id: string) => Task | undefined;

  filterTasks: (filter: TaskStatusFilter) => Task[];
  refreshTasks: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextData>(
  {} as TaskContextData,
);

interface TaskProviderProps {
  children: React.ReactNode;
}

export function TaskProvider({
  children,
}: TaskProviderProps) {
  const { user } = useAuth();

  const userId = user?.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUserTasks() {
      setTasks([]);
      setLoading(true);
      setError(null);

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const storedTasks = await loadTasks(userId);

        if (active) {
          setTasks(storedTasks);
        }
      } catch {
        if (active) {
          setError('Não foi possível carregar as tarefas.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUserTasks();

    return () => {
      active = false;
    };
  }, [userId]);

  const ensureUser = useCallback((): string => {
    if (!userId) {
      throw new Error(
        'É necessário estar autenticado para gerenciar tarefas.',
      );
    }

    if (loading) {
      throw new Error(
        'Aguarde o carregamento das tarefas.',
      );
    }

    return userId;
  }, [userId, loading]);

  const persistTasks = useCallback(
    async (nextTasks: Task[]) => {
      const currentUserId = ensureUser();

      setError(null);

      try {
        await saveTasks(currentUserId, nextTasks);
        setTasks(nextTasks);
      } catch {
        const message =
          'Não foi possível salvar as tarefas.';

        setError(message);
        throw new Error(message);
      }
    },
    [ensureUser],
  );

  const addTask = useCallback(
    async (input: TaskInput): Promise<Task> => {
      const currentUserId = ensureUser();

      const errors = validateTask(input);

      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      const now = new Date().toISOString();

      const newTask: Task = {
        id: generateId(),
        userId: currentUserId,
        title: input.title.trim(),
        description: input.description.trim(),
        status: input.status,
        priority: input.priority,
        category: input.category,
        createdAt: now,
        updatedAt: now,
      };

      await persistTasks([...tasks, newTask]);

      return newTask;
    },
    [ensureUser, persistTasks, tasks],
  );

  const updateTask = useCallback(
    async (
      id: string,
      input: TaskInput,
    ): Promise<Task> => {
      const currentUserId = ensureUser();

      const errors = validateTask(input);

      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      const existingTask = tasks.find(
        (task) =>
          task.id === id &&
          task.userId === currentUserId,
      );

      if (!existingTask) {
        throw new Error('Tarefa não encontrada.');
      }

      const updatedTask: Task = {
        ...existingTask,
        title: input.title.trim(),
        description: input.description.trim(),
        status: input.status,
        priority: input.priority,
        category: input.category,
        updatedAt: new Date().toISOString(),
      };

      const nextTasks = tasks.map((task) =>
        task.id === id &&
        task.userId === currentUserId
          ? updatedTask
          : task,
      );

      await persistTasks(nextTasks);

      return updatedTask;
    },
    [ensureUser, persistTasks, tasks],
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      const currentUserId = ensureUser();

      const existingTask = tasks.find(
        (task) =>
          task.id === id &&
          task.userId === currentUserId,
      );

      if (!existingTask) {
        throw new Error('Tarefa não encontrada.');
      }

      const nextTasks = tasks.filter(
        (task) =>
          !(
            task.id === id &&
            task.userId === currentUserId
          ),
      );

      await persistTasks(nextTasks);
    },
    [ensureUser, persistTasks, tasks],
  );

  const getTaskById = useCallback(
    (id: string): Task | undefined => {
      if (!userId) {
        return undefined;
      }

      return tasks.find(
        (task) =>
          task.id === id &&
          task.userId === userId,
      );
    },
    [tasks, userId],
  );

  const filterTasks = useCallback(
    (filter: TaskStatusFilter): Task[] => {
      if (filter === 'todas') {
        return tasks;
      }

      if (filter === 'pendente') {
        return tasks.filter(
          (task) =>
            task.status === 'pendente' ||
            task.status === 'em_andamento',
        );
      }

      return tasks.filter(
        (task) => task.status === filter,
      );
    },
    [tasks],
  );

  const refreshTasks = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storedTasks = await loadTasks(userId);
      setTasks(storedTasks);
    } catch {
      const message =
        'Não foi possível carregar as tarefas.';

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      addTask,
      updateTask,
      deleteTask,
      getTaskById,
      filterTasks,
      refreshTasks,
    }),
    [
      tasks,
      loading,
      error,
      addTask,
      updateTask,
      deleteTask,
      getTaskById,
      filterTasks,
      refreshTasks,
    ],
  );

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}