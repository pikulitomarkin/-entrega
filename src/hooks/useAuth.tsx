import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'admin' | 'usuario';

interface AuthContextType {
  user: null | { username: string; role: UserRole };
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<null | { username: string; role: UserRole }>(null);

  async function login(username: string, password: string) {
    // Simulação: admin/admin = admin, qualquer outro = usuario
    if (username === 'admin' && password === 'admin') {
      setUser({ username, role: 'admin' });
      return true;
    } else if (username && password) {
      setUser({ username, role: 'usuario' });
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
