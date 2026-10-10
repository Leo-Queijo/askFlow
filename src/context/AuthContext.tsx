import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type {
  LoginCredentials,
  User,
} from '../types/user';

import {
  clearSession,
  getSession,
  saveSession,
} from '../services/authStorage';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const users: Array<User & { password: string }> = [
  {
    id: 1,
    username: 'admin',
    password: '123',
    role: 'admin',
    name: 'Administrador',
  },
  {
    id: 2,
    username: 'user',
    password: '123',
    role: 'user',
    name: 'Usuário Comum',
  },
];

export const AuthContext = createContext<
  AuthContextData | undefined
>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session = await getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  const login = useCallback(
    async ({
      username,
      password,
    }: LoginCredentials): Promise<void> => {
      const normalizedUsername = username.trim();

      const foundUser = users.find(
        (item) =>
          item.username === normalizedUsername &&
          item.password === password,
      );

      if (!foundUser) {
        throw new Error('Usuário ou senha inválidos.');
      }

      const authenticatedUser: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name,
      };

      await saveSession(authenticatedUser);
      setUser(authenticatedUser);
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    await clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}