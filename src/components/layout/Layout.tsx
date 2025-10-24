import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-dark-400">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#adb5bd',
            color: '#212529',
            border: '1px solid #6c757d',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#212529',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#212529',
            },
          },
        }}
      />
    </div>
  );
}
