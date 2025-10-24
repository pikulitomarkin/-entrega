import { useState } from 'react';
import { TruckIcon, User, MapPin, Clock, Phone, Plus, Navigation } from 'lucide-react';
import { useDeliveryStore } from '../store/deliveryStore';
import { useOrderStore } from '../store/orderStore';
import { OrderStatus } from '../types';
import NewDelivererModal from '../components/deliveries/NewDelivererModal';
import NewDeliveryModal from '../components/deliveries/NewDeliveryModal';
import toast from 'react-hot-toast';

export default function Deliveries() {
  const [activeTab, setActiveTab] = useState<'active' | 'deliverers'>('active');
  const [isNewDelivererModalOpen, setIsNewDelivererModalOpen] = useState(false);
  const [isNewDeliveryModalOpen, setIsNewDeliveryModalOpen] = useState(false);
  const deliveries = useDeliveryStore(state => state.deliveries);
  const deliverers = useDeliveryStore(state => state.deliverers);
  const orders = useOrderStore(state => state.orders);
  const updateDeliverer = useDeliveryStore(state => state.updateDeliverer);

  const activeDeliveries = deliveries.filter(d => d.status !== 'delivered');
  const readyOrders = orders.filter(o => o.status === OrderStatus.READY);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Entregas</h1>
          <p className="text-dark-700">Gerencie entregas e entregadores</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsNewDelivererModalOpen(true)}
            className="flex items-center gap-2 bg-dark-500 border border-dark-300 text-dark-900 px-4 py-2.5 rounded-lg hover:bg-dark-400 transition-colors font-medium"
          >
            <User className="w-5 h-5" />
            Adicionar Entregador
          </button>
          <button
            onClick={() => setIsNewDeliveryModalOpen(true)}
            className="flex items-center gap-2 bg-accent-500 text-white px-4 py-2.5 rounded-lg hover:bg-accent-600 transition-colors font-medium"
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
          bgColor="bg-accent-100"
          iconColor="text-accent-700"
        />
        <StatCard
          title="Entregadores Disponíveis"
          value={deliverers.filter(d => d.isAvailable).length}
          icon={User}
          bgColor="bg-green-100"
          iconColor="text-green-700"
        />
        <StatCard
          title="Pedidos Prontos"
          value={readyOrders.length}
          icon={Clock}
          bgColor="bg-yellow-100"
          iconColor="text-yellow-700"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-300">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-3 font-medium transition-colors relative ${
            activeTab === 'active'
              ? 'text-dark-900'
              : 'text-dark-600 hover:text-dark-900'
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
              ? 'text-dark-900'
              : 'text-dark-600 hover:text-dark-900'
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

function ActiveDeliveries({ deliveries, orders }: any) {
  if (deliveries.length === 0) {
    return (
      <div className="bg-dark-500 rounded-lg border border-dark-300 p-12 text-center">
        <div className="w-16 h-16 rounded-lg bg-dark-400 flex items-center justify-center mx-auto mb-4">
          <TruckIcon className="w-8 h-8 text-dark-600" />
        </div>
        <p className="text-dark-700 mb-1">Nenhuma entrega ativa</p>
        <p className="text-sm text-dark-600">As entregas em andamento aparecer��o aqui</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {deliveries.map((delivery: any) => {
        const order = orders.find((o: any) => o.id === delivery.orderId);
        if (!order) return null;

        return (
          <div key={delivery.id} className="bg-dark-500 rounded-lg border border-dark-300 p-6">
            {/* Delivery Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                  <TruckIcon className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <p className="font-semibold text-dark-900">{order.customer.name}</p>
                  <p className="text-sm text-dark-700">Pedido #{order.id.slice(0, 8)}</p>
                </div>
              </div>
              <DeliveryStatusBadge status={delivery.status} />
            </div>

            {/* Deliverer Info */}
            {delivery.deliverer && (
              <div className="flex items-center gap-3 p-3 bg-dark-400 rounded-lg mb-4">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark-900">{delivery.deliverer.name}</p>
                  <p className="text-xs text-dark-700">{delivery.deliverer.phone}</p>
                </div>
                <button className="p-2 hover:bg-dark-300 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-dark-600" />
                </button>
              </div>
            )}

            {/* Address */}
            {order.customer.address && (
              <div className="flex items-start gap-3 p-3 bg-dark-400 rounded-lg mb-4">
                <MapPin className="w-5 h-5 text-dark-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-dark-700">{order.customer.address}</p>
              </div>
            )}

            {/* Order Details */}
            <div className="flex items-center justify-between pt-4 border-t border-dark-300">
              <div className="text-sm text-dark-700">
                {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
              </div>
              <div className="text-lg font-bold text-dark-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(order.total)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-accent-500 text-white px-4 py-2.5 rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium">
                <Navigation className="w-4 h-4" />
                Ver Rota
              </button>
              <button className="flex-1 bg-dark-400 text-dark-900 px-4 py-2.5 rounded-lg hover:bg-dark-300 transition-colors text-sm font-medium">
                Detalhes
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DeliverersTab({ deliverers }: any) {
  if (deliverers.length === 0) {
    return (
      <div className="bg-dark-500 rounded-lg border border-dark-300 p-12 text-center">
        <div className="w-16 h-16 rounded-lg bg-dark-400 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-dark-600" />
        </div>
        <p className="text-dark-700 mb-1">Nenhum entregador cadastrado</p>
        <p className="text-sm text-dark-600">Adicione entregadores para começar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deliverers.map((deliverer: any) => (
        <div key={deliverer.id} className="bg-dark-500 rounded-lg border border-dark-300 p-6">
          {/* Deliverer Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {deliverer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-dark-900">{deliverer.name}</p>
              <p className="text-sm text-dark-700">{deliverer.phone}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-dark-700">Status</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
              deliverer.isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {deliverer.isAvailable ? 'Disponível' : 'Indisponível'}
            </span>
          </div>

          {/* Stats */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-700">Entregas Ativas</span>
              <span className="font-medium text-dark-900">{deliverer.currentDeliveries}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 bg-dark-400 text-dark-900 px-4 py-2 rounded-lg hover:bg-dark-300 transition-colors text-sm font-medium">
              Ver Perfil
            </button>
            <button className="p-2 bg-dark-400 text-dark-900 rounded-lg hover:bg-dark-300 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, bgColor, iconColor }: any) {
  return (
    <div className="bg-dark-500 rounded-lg p-6 border border-dark-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-dark-900 mb-1">{value}</p>
      <p className="text-sm text-dark-700">{title}</p>
    </div>
  );
}

function DeliveryStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    waiting: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    assigned: { bg: 'bg-blue-100', text: 'text-blue-700' },
    picked_up: { bg: 'bg-purple-100', text: 'text-purple-700' },
    in_transit: { bg: 'bg-accent-100', text: 'text-accent-700' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700' },
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
    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.text}`}>
      {labels[status] || status}
    </span>
  );
}
