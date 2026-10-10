
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StoredSession, User } from '../types/user';

const SESSION_STORAGE_KEY = '@askflow:session';

export async function saveSession(user: User): Promise<void> {
  const session: StoredSession = { user };

  await AsyncStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
}

export async function getSession(): Promise<StoredSession | null> {
  const storedSession = await AsyncStorage.getItem(
    SESSION_STORAGE_KEY,
  );

  if (!storedSession) {
    return null;
  }

  return JSON.parse(storedSession) as StoredSession;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}
