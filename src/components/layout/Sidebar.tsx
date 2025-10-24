import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, TruckIcon, MessageCircle, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/orders', icon: Package },
  { name: 'Entregas', href: '/deliveries', icon: TruckIcon },
  { name: 'WhatsApp', href: '/whatsapp', icon: MessageCircle },
];

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-dark-600 border-r border-dark-500">
      <div className="p-6">
        {/* Logo */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark-900">ÓEntrega</h1>
              <p className="text-xs text-dark-700">Sistema de Gestão</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-accent-500 text-white'
                    : 'text-dark-700 hover:bg-dark-500 hover:text-dark-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Settings */}
        <div className="mt-8 pt-8 border-t border-dark-500">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-700 hover:bg-dark-500 hover:text-dark-900 transition-all w-full">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-dark-500 rounded-lg p-4 border border-dark-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-900 truncate">Admin</p>
                <p className="text-xs text-dark-700">admin@oentrega.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
