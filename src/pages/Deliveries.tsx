import { useState } from 'react';
import { TruckIcon, User, MapPin, Clock, Phone, Plus, Navigation } from 'lucide-react';
import { useDeliveryStore } from '../store/deliveryStore';
import { useOrderStore } from '../store/orderStore';
import type { Order, Deliverer, Delivery } from '../types';
import { OrderStatus } from '../types';
import NewDelivererModal from '../components/deliveries/NewDelivererModal';
import NewDeliveryModal from '../components/deliveries/NewDeliveryModal';

export default function Deliveries() {
  const [activeTab, setActiveTab] = useState<'active' | 'deliverers'>('active');
  const [isNewDelivererModalOpen, setIsNewDelivererModalOpen] = useState(false);
  const [isNewDeliveryModalOpen, setIsNewDeliveryModalOpen] = useState(false);
  const deliveries = useDeliveryStore(state => state.deliveries);
  const deliverers = useDeliveryStore(state => state.deliverers);
  const orders = useOrderStore(state => state.orders);

  const activeDeliveries = deliveries.filter(d => d.status !== 'delivered');
  const readyOrders = orders.filter(o => o.status === OrderStatus.READY);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Entregas</h1>
          <p className="text-dark-300">Gerencie entregas e entregadores</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsNewDelivererModalOpen(true)}
            className="flex items-center gap-2 bg-dark-900 border border-dark-800 text-white px-4 py-2.5 rounded-xl hover:bg-dark-800 transition-colors font-medium"
          >
            <User className="w-5 h-5" />
            Adicionar Entregador
          </button>
          <button
            onClick={() => setIsNewDeliveryModalOpen(true)}
            className="flex items-center gap-2 bg-accent-500 text-white px-4 py-2.5 rounded-xl hover:bg-accent-600 transition-colors font-medium shadow-accent"
          >
            <Plus className="w-5 h-5" />
            Nova Entrega
          </button>
        </div>
      </div>

      <NewDelivererModal
        isOpen={isNewDelivererModalOpen}
        onClose={() => setIsNewDelivererModalOpen(false)}
      />
      <NewDeliveryModal
        isOpen={isNewDeliveryModalOpen}
        onClose={() => setIsNewDeliveryModalOpen(false)}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Entregas Ativas"
          value={activeDeliveries.length}
          icon={TruckIcon}
          color="accent"
        />
        <StatCard
          title="Entregadores Disponíveis"
          value={deliverers.filter(d => d.isAvailable).length}
          icon={User}
          color="green"
        />
        <StatCard
          title="Pedidos Prontos"
          value={readyOrders.length}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-800">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-3 font-medium transition-colors relative ${
            activeTab === 'active'
              ? 'text-white'
              : 'text-dark-400 hover:text-white'
          }`}
        >
          Entregas Ativas
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('deliverers')}
          className={`px-4 py-3 font-medium transition-colors relative ${
            activeTab === 'deliverers'
              ? 'text-white'
              : 'text-dark-400 hover:text-white'
          }`}
        >
          Entregadores
          {activeTab === 'deliverers' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500"></div>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'active' ? (
        <ActiveDeliveries deliveries={activeDeliveries} orders={orders} />
      ) : (
        <DeliverersTab deliverers={deliverers} />
      )}
    </div>
  );
}

function ActiveDeliveries({ deliveries, orders }: { deliveries: Delivery[], orders: Order[] }) {
  if (deliveries.length === 0) {
    return (
      <div className="bg-dark-900 rounded-2xl border border-dark-800 p-12 text-center">
        <div className="w-16 h-16 rounded-lg bg-dark-800 flex items-center justify-center mx-auto mb-4">
          <TruckIcon className="w-8 h-8 text-dark-600" />
        </div>
        <p className="text-dark-300 mb-1">Nenhuma entrega ativa</p>
        <p className="text-sm text-dark-400">As entregas em andamento aparecerão aqui</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {deliveries.map((delivery) => {
        const order = orders.find((o) => o.id === delivery.orderId);
        if (!order) return null;

        return (
          <div key={delivery.id} className="bg-dark-900 rounded-2xl border border-dark-800 p-6">
            {/* Delivery Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
                  <TruckIcon className="w-6 h-6 text-accent-500" />
                </div>
                <div>
                  <p className="font-semibold text-white">{order.customer.name}</p>
                  <p className="text-sm text-dark-400">Pedido #{order.id.slice(0, 8)}</p>
                </div>
              </div>
              <DeliveryStatusBadge status={delivery.status} />
            </div>

            {/* Deliverer Info */}
            {delivery.deliverer && (
              <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl mb-4">
                <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{delivery.deliverer.name}</p>
                  <p className="text-xs text-dark-400">{delivery.deliverer.phone}</p>
                </div>
                <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-dark-300" />
                </button>
              </div>
            )}

            {/* Address */}
            {order.customer.address && (
              <div className="flex items-start gap-3 p-3 bg-dark-800 rounded-xl mb-4">
                <MapPin className="w-5 h-5 text-dark-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-dark-300">{order.customer.address}</p>
              </div>
            )}

            {/* Order Details */}
            <div className="flex items-center justify-between pt-4 border-t border-dark-800">
              <div className="text-sm text-dark-300">
                {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
              </div>
              <div className="text-lg font-bold text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(order.total)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-accent-500 text-white px-4 py-2.5 rounded-xl hover:bg-accent-600 transition-colors text-sm font-medium">
                <Navigation className="w-4 h-4" />
                Ver Rota
              </button>
              <button className="flex-1 bg-dark-800 text-white px-4 py-2.5 rounded-xl hover:bg-dark-700 transition-colors text-sm font-medium">
                Detalhes
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DeliverersTab({ deliverers }: { deliverers: Deliverer[] }) {
  if (deliverers.length === 0) {
    return (
      <div className="bg-dark-900 rounded-2xl border border-dark-800 p-12 text-center">
        <div className="w-16 h-16 rounded-lg bg-dark-800 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-dark-600" />
        </div>
        <p className="text-dark-300 mb-1">Nenhum entregador cadastrado</p>
        <p className="text-sm text-dark-400">Adicione entregadores para começar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deliverers.map((deliverer) => (
        <div key={deliverer.id} className="bg-dark-900 rounded-2xl border border-dark-800 p-6">
          {/* Deliverer Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-accent-500/10 flex items-center justify-center border-2 border-accent-500">
              <span className="text-accent-500 font-bold text-lg">
                {deliverer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{deliverer.name}</p>
              <p className="text-sm text-dark-400">{deliverer.phone}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-dark-300">Status</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
              deliverer.isAvailable
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}>
              {deliverer.isAvailable ? 'Disponível' : 'Indisponível'}
            </span>
          </div>

          {/* Stats */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-300">Entregas Ativas</span>
              <span className="font-medium text-white">{deliverer.currentDeliveries}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 bg-dark-800 text-white px-4 py-2 rounded-xl hover:bg-dark-700 transition-colors text-sm font-medium">
              Ver Perfil
            </button>
            <button className="p-2 bg-dark-800 text-white rounded-xl hover:bg-dark-700 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const colorSchemes = {
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400' },
  accent: { bg: 'bg-accent-500/10', text: 'text-accent-400' },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: keyof typeof colorSchemes;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const scheme = colorSchemes[color];
  return (
    <div className="bg-dark-900 rounded-2xl p-6 border border-dark-800 shadow-sm hover:border-dark-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${scheme.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${scheme.text}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-dark-400">{title}</p>
    </div>
  );
}

function DeliveryStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    waiting: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    assigned: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    picked_up: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    in_transit: { bg: 'bg-accent-500/10', text: 'text-accent-400' },
    delivered: { bg: 'bg-green-500/10', text: 'text-green-400' },
  };

  const labels: Record<string, string> = {
    waiting: 'Aguardando',
    assigned: 'Atribuído',
    picked_up: 'Coletado',
    in_transit: 'Em Trânsito',
    delivered: 'Entregue'
  };

  const style = styles[status] || styles.waiting;

  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${style.bg} ${style.text}`}>
      {labels[status] || status}
    </span>
  );
}
