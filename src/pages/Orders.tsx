import React, { useState } from 'react';
import { Plus, Search, Filter, Package, Clock, MoreVertical, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { OrderStatus } from '../types';
import NewOrderModal from '../components/orders/NewOrderModal';
import toast from 'react-hot-toast';

export default function Orders() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const orders = useOrderStore(state => state.orders);
  const updateOrderStatus = useOrderStore(state => state.updateOrderStatus);
  const deleteOrder = useOrderStore(state => state.deleteOrder);

  const [isLoading, setIsLoading] = useState(false);
  const [_isOrderDetailsModalOpen, _setIsOrderDetailsModalOpen] = useState(false);
  const [_orderToView, _setOrderToView] = useState<import('../types').Order | null>(null);
  // Simula carregamento inicial
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedidos</h1>
          <p className="text-gray-600">Gerencie todos os pedidos do sistema</p>
        </div>
        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
        >
          <Plus className="w-5 h-5" />
          Novo Pedido
        </button>
      </div>

      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-red-100 rounded-lg pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 bg-white border border-red-100 text-gray-900 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium">
          <Filter className="w-5 h-5" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'Todos', count: orders.length },
          { value: OrderStatus.PENDING, label: 'Pendentes', count: orders.filter(o => o.status === OrderStatus.PENDING).length },
          { value: OrderStatus.PREPARING, label: 'Em Preparo', count: orders.filter(o => o.status === OrderStatus.PREPARING).length },
          { value: OrderStatus.READY, label: 'Prontos', count: orders.filter(o => o.status === OrderStatus.READY).length },
          { value: OrderStatus.OUT_FOR_DELIVERY, label: 'Em Entrega', count: orders.filter(o => o.status === OrderStatus.OUT_FOR_DELIVERY).length },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === tab.value
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-red-50 border border-red-100'
            }`}
          >
            {tab.label} <span className="ml-1.5 opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg border border-red-100 overflow-hidden shadow-md">
        {isLoading ? (
          <div className="divide-y divide-red-100 animate-pulse">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-red-100 rounded" />
                  <div className="h-3 w-1/2 bg-red-50 rounded" />
                </div>
                <div className="w-20 h-6 bg-red-100 rounded" />
                <div className="w-8 h-8 bg-red-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-lg bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-300" />
            </div>
            <p className="text-gray-700 mb-1">Nenhum pedido encontrado</p>
            <p className="text-sm text-gray-500"></p>
          </div>
        ) : (
          <div className="divide-y divide-red-100">
            {filteredOrders.map((order, idx) => (
              <div
                key={order.id}
                className="p-6 hover:bg-red-50 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => {
                  _setOrderToView(order);
                  _setIsOrderDetailsModalOpen(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Order Icon */}
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-red-600" />
                    </div>
                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-lg text-gray-900">{order.customer.name}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2 px-2 py-1 rounded-lg bg-red-50">
                          <span className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-red-600" />
                          </span>
                          <span className="font-medium text-gray-700">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span>
                        </span>
                        <span className="flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-50">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </span>
                          <span className="font-medium text-gray-700">{new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </span>
                        <span className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50">
                          <span className="font-medium text-gray-700">
                            {order.source === 'whatsapp' ? '💬 WhatsApp' : order.source === 'phone' ? '📞 Telefone' : '📝 Manual'}
                          </span>
                        </span>
                      </div>
                    </div>
                    {/* Order Total */}
                    <div className="text-right mr-4">
                      <p className="text-xl font-bold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(order.total)}
                      </p>
                      {order.notes && (
                        <p className="text-xs text-gray-500 mt-1">Com observações</p>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionsMenu(showActionsMenu === order.id ? null : order.id);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                      {showActionsMenu === order.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowActionsMenu(null)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-red-100 rounded-lg shadow-lg z-20 overflow-hidden">
                            {order.status !== OrderStatus.DELIVERED && (
                              <button
                                onClick={() => {
                                  const nextStatus = getNextStatus(order.status);
                                  if (nextStatus) {
                                    updateOrderStatus(order.id, nextStatus as import('../types').OrderStatus);
                                    toast.success('Status atualizado!');
                                  }
                                  setShowActionsMenu(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-900 hover:bg-red-50 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Avançar Status
                              </button>
                            )}
                            <button
                              onClick={() => {
                                toast.success('Função em desenvolvimento');
                                setShowActionsMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-900 hover:bg-red-50 transition-colors"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Deseja realmente excluir este pedido?')) {
                                  deleteOrder(order.id);
                                  toast.success('Pedido excluído!');
                                }
                                setShowActionsMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Excluir
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Order Items Preview */}
                {order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-red-100">
                    <p className="text-sm text-gray-600 mb-2">Itens do pedido:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-100"
                        >
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>Mostrando {filteredOrders.length} de {orders.length} pedidos</p>
          <p>
            Total: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(filteredOrders.reduce((sum, order) => sum + order.total, 0))}
          </p>
        </div>
      )}
    </div>
  );
}

function getNextStatus(currentStatus: string): string | null {
  const statusFlow: Record<string, string> = {
    [OrderStatus.PENDING]: OrderStatus.PREPARING,
    [OrderStatus.PREPARING]: OrderStatus.READY,
    [OrderStatus.READY]: OrderStatus.OUT_FOR_DELIVERY,
    [OrderStatus.OUT_FOR_DELIVERY]: OrderStatus.DELIVERED,
  };
  return statusFlow[currentStatus] || null;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
    preparing: { bg: 'bg-blue-50', text: 'text-blue-700' },
    ready: { bg: 'bg-green-50', text: 'text-green-700' },
    out_for_delivery: { bg: 'bg-red-50', text: 'text-red-700' },
    delivered: { bg: 'bg-gray-100', text: 'text-gray-600' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const labels: Record<string, string> = {
    pending: 'Pendente',
    preparing: 'Em Preparo',
    ready: 'Pronto',
    out_for_delivery: 'Saiu para Entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };

  const style = styles[status] || styles.pending;

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.text} border ${style.text === 'text-gray-600' ? 'border-gray-200' : 'border-current/20'}`}>
      {labels[status] || status}
    </span>
  );
}
