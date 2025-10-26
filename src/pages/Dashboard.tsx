import { Package, Clock, CheckCircle, TruckIcon, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { OrderStatus } from '../types';

export default function Dashboard() {
  const orders = useOrderStore(state => state.orders);

  const stats = {
    pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
    preparing: orders.filter(o => o.status === OrderStatus.PREPARING).length,
    ready: orders.filter(o => o.status === OrderStatus.READY).length,
    delivering: orders.filter(o => o.status === OrderStatus.OUT_FOR_DELIVERY).length,
  };

  const total = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600 text-lg">Visão geral do seu sistema de entregas.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pedidos Pendentes"
            value={stats.pending}
            icon={Clock}
            color="yellow"
            trend="+12%"
          />
          <StatCard
            title="Em Preparo"
            value={stats.preparing}
            icon={Package}
            color="blue"
            trend="+8%"
          />
          <StatCard
            title="Prontos para Envio"
            value={stats.ready}
            icon={CheckCircle}
            color="green"
            trend="+23%"
          />
          <StatCard
            title="Em Rota de Entrega"
            value={stats.delivering}
            icon={TruckIcon}
            color="red"
            trend="+5%"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Revenue and Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white rounded-2xl p-6 border border-red-100 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">Faturamento do Dia</h3>
                  <div className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4" />
                    <span>+12.5%</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-red-600 mb-2">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </p>
                <p className="text-sm text-gray-500">Comparado a ontem</p>
              </div>
              <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-red-100 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-md font-semibold text-gray-900 mb-6">Métricas Chave</h3>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <QuickMetric label="Total de Pedidos" value={orders.length} />
                  <QuickMetric label="Taxa de Sucesso" value="94%" />
                  <QuickMetric label="Tempo Médio Entrega" value="38 min" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-md overflow-hidden">
              <div className="p-6 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
                  <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
                    Ver todos
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-red-100">
                {orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-red-300" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">Nenhum pedido encontrado</p>
                    <p className="text-sm text-gray-500">Quando um novo pedido for criado, ele aparecerá aqui.</p>
                  </div>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="p-4 sm:p-6 hover:bg-red-50 transition-colors cursor-pointer">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center border border-red-200">
                            <Package className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{order.customer.name}</p>
                            <p className="text-sm text-gray-500">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} •
                              {' '}{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className="font-bold text-gray-900 text-lg">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                          </p>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const colorSchemes = {
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: keyof typeof colorSchemes;
  trend: string;
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  const scheme = colorSchemes[color];
  return (
    <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${scheme.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${scheme.text}`} />
        </div>
        <span className="text-sm text-green-600 font-medium">{trend}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
    </div>
  );
}

function QuickMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-3xl font-bold text-red-600 mb-1">{value}</p>
      <p className="text-xs text-gray-500 text-center">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus | string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    [OrderStatus.PENDING]: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    [OrderStatus.PREPARING]: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    [OrderStatus.READY]: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    [OrderStatus.OUT_FOR_DELIVERY]: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-600' },
    [OrderStatus.DELIVERED]: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    [OrderStatus.CANCELLED]: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-600' },
  };

  const labels: Record<string, string> = {
    [OrderStatus.PENDING]: 'Pendente',
    [OrderStatus.PREPARING]: 'Em Preparo',
    [OrderStatus.READY]: 'Pronto',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Em Entrega',
    [OrderStatus.DELIVERED]: 'Entregue',
    [OrderStatus.CANCELLED]: 'Cancelado'
  };

  const style = styles[status] || styles[OrderStatus.PENDING];
  const label = labels[status] || status;

  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-2 ${style.bg} ${style.text}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
      {label}
    </span>
  );
}
