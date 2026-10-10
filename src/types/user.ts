
export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface StoredSession {
  user: User;
}
