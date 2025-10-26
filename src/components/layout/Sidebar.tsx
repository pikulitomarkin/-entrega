import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, TruckIcon, MessageCircle, Settings, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/orders', icon: Package },
  { name: 'Entregas', href: '/deliveries', icon: TruckIcon },
  { name: 'WhatsApp', href: '/whatsapp', icon: MessageCircle },
];

const adminNavigation = [
  { name: 'Users', href: '/users', icon: Users },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-red-600 to-red-700 border-r border-red-800 flex flex-col shadow-lg">
      <div className="p-6">
        {/* Logo */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ÓEntrega</h1>
              <p className="text-xs text-red-100">Sistema de Gestão</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base font-medium ${
                  isActive
                    ? 'bg-white text-red-600 shadow-md'
                    : 'text-red-100 hover:bg-red-500/30 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
          {user?.role === 'admin' && adminNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base font-medium ${
                  isActive
                    ? 'bg-white text-red-600 shadow-md'
                    : 'text-red-100 hover:bg-red-500/30 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Footer */}
      <div className="p-6">
        <div className="mt-8 pt-8 border-t border-red-500">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-100 hover:bg-red-500/30 hover:text-white transition-all w-full font-medium">
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </button>
        </div>
        <div className="bg-red-500/20 rounded-lg p-4 mt-4 border border-red-400/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-red-600 font-semibold text-sm flex items-center justify-center shadow-md">
                {(user?.name || user?.username)?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || user?.username || 'Usuário'}</p>
                <p className="text-xs text-red-100">{user?.email || user?.phone || 'Sem email'}</p>
              </div>
            </div>
            <button onClick={logout} className="text-red-100 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
