import type { ReactNode } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

interface AppWrapperProps {
  children: ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#dc2626',
            color: '#ffffff',
            border: '1px solid #b91c1c',
            borderRadius: '0.5rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}
