import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/task";

const STORAGE_PREFIX = "@TaskFlow:tasks:";

function getStorageKey(userId: number): string {
  return `${STORAGE_PREFIX}${userId}`;
}

export async function getTasks(userId: number): Promise<Task[]> {
  const data = await AsyncStorage.getItem(getStorageKey(userId));

  if (!data) {
    return [];
  }

  const parsed: unknown = JSON.parse(data);

  if (!Array.isArray(parsed)) {
    throw new Error("Os dados das tarefas são inválidos.");
  }

  return (parsed as Task[]).filter((task) => task.userId === userId);
}

export async function saveTasks(userId: number, tasks: Task[]): Promise<void> {
  const userTasks = tasks.filter((task) => task.userId === userId);

  await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify(userTasks));
}

export async function clearTasks(userId: number): Promise<void> {
  await AsyncStorage.removeItem(getStorageKey(userId));
}
