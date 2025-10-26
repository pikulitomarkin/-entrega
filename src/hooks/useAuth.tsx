import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  async function login(emailOrUsername: string, password: string) {
    // Simulação: admin@oentrega.com/123456 = admin, qualquer outro = deliverer
    if ((emailOrUsername === 'admin' || emailOrUsername === 'admin@oentrega.com') && password === '123456') {
      setUser({
        id: 'admin-1',
        username: 'admin',
        email: 'admin@oentrega.com',
        role: 'admin' as UserRole,
        name: 'Administrador',
        createdAt: new Date()
      });
      return true;
    } else if (emailOrUsername && password) {
      // Accept any other credentials for demo purposes
      setUser({
        id: Date.now().toString(),
        username: emailOrUsername,
        email: emailOrUsername,
        role: 'deliverer' as UserRole,
        name: emailOrUsername,
        createdAt: new Date()
      });
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
