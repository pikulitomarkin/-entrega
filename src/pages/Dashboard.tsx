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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900 mb-2">Dashboard</h1>
        <p className="text-dark-700">Visão geral do sistema de entregas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pending}
          icon={Clock}
          bgColor="bg-yellow-100"
          iconColor="text-yellow-700"
          trend="+12%"
        />
        <StatCard
          title="Em Preparo"
          value={stats.preparing}
          icon={Package}
          bgColor="bg-blue-100"
          iconColor="text-blue-700"
          trend="+8%"
        />
        <StatCard
          title="Prontos"
          value={stats.ready}
          icon={CheckCircle}
          bgColor="bg-green-100"
          iconColor="text-green-700"
          trend="+23%"
        />
        <StatCard
          title="Em Entrega"
          value={stats.delivering}
          icon={TruckIcon}
          bgColor="bg-accent-100"
          iconColor="text-accent-700"
          trend="+5%"
        />
      </div>

      {/* Revenue and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="lg:col-span-1 bg-dark-500 rounded-lg p-6 border border-dark-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dark-900">Faturamento Hoje</h3>
            <div className="flex items-center gap-1 text-green-700 text-sm bg-green-100 px-2 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>
          <p className="text-4xl font-bold text-dark-900 mb-2">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(total)}
          </p>
          <p className="text-sm text-dark-700">Em comparação com ontem</p>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 bg-dark-500 rounded-lg p-6 border border-dark-300">
          <h3 className="text-sm font-medium text-dark-700 mb-6">Métricas Rápidas</h3>
          <div className="grid grid-cols-3 gap-6">
            <QuickMetric label="Total de Pedidos" value={orders.length} />
            <QuickMetric label="Taxa de Sucesso" value="94%" />
            <QuickMetric label="Tempo Médio" value="38min" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-dark-500 rounded-lg border border-dark-300 overflow-hidden">
        <div className="p-6 border-b border-dark-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark-900">Pedidos Recentes</h3>
            <button className="text-sm text-accent-600 hover:text-accent-700 transition-colors flex items-center gap-1">
              Ver todos
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-dark-300">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-lg bg-dark-400 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-dark-600" />
              </div>
              <p className="text-dark-600 mb-1">Nenhum pedido ainda</p>
              <p className="text-sm text-dark-700">Crie seu primeiro pedido para começar!</p>
            </div>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="p-6 hover:bg-dark-400 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-medium text-dark-900">{order.customer.name}</p>
                      <p className="text-sm text-dark-700">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} •
                        {' '}{new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-dark-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(order.total)}
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
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  trend: string;
}

function StatCard({ title, value, icon: Icon, bgColor, iconColor, trend }: StatCardProps) {
  return (
    <div className="bg-dark-500 rounded-lg p-6 border border-dark-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <span className="text-sm text-green-700 font-medium">{trend}</span>
      </div>
      <p className="text-3xl font-bold text-dark-900 mb-1">{value}</p>
      <p className="text-sm text-dark-700">{title}</p>
    </div>
  );
}

function QuickMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-2xl font-bold text-dark-900 mb-1">{value}</p>
      <p className="text-xs text-dark-700">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    preparing: { bg: 'bg-blue-100', text: 'text-blue-700' },
    ready: { bg: 'bg-green-100', text: 'text-green-700' },
    out_for_delivery: { bg: 'bg-accent-100', text: 'text-accent-700' },
    delivered: { bg: 'bg-dark-300', text: 'text-dark-700' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const labels: Record<string, string> = {
    pending: 'Pendente',
    preparing: 'Preparo',
    ready: 'Pronto',
    out_for_delivery: 'Entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };

  const style = styles[status] || styles.pending;

  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${style.bg} ${style.text}`}>
      {labels[status] || status}
    </span>
  );
}
