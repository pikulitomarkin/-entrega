import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useDeliveryStore } from '../../store/deliveryStore';
import { useOrderStore } from '../../store/orderStore';
import { DeliveryStatus } from '../../types';
import { generateId } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface NewDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewDeliveryModal({ isOpen, onClose }: NewDeliveryModalProps) {
  const addDelivery = useDeliveryStore(state => state.addDelivery);
  const deliverers = useDeliveryStore(state => state.deliverers);
  const orders = useOrderStore(state => state.orders);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedDelivererId, setSelectedDelivererId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const readyOrders = orders.filter(o => o.status === 'ready');
  const availableDeliverers = deliverers.filter(d => d.isAvailable);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!selectedOrderId || !selectedDelivererId) {
      toast.error('Selecione pedido e entregador');
      setIsLoading(false);
      return;
    }
    const delivery = {
      id: generateId(),
      orderId: selectedOrderId,
      deliverer: deliverers.find(d => d.id === selectedDelivererId),
      status: DeliveryStatus.ASSIGNED,
      createdAt: new Date(),
    };
    addDelivery(delivery);
    toast.success('Entrega criada e atribuída!');
    setSelectedOrderId('');
    setSelectedDelivererId('');
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Entrega" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Pedido Pronto</label>
          <select
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-500"
            value={selectedOrderId}
            onChange={e => setSelectedOrderId(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {readyOrders.map(order => (
              <option key={order.id} value={order.id}>
                {order.customer.name} - {order.items.length} itens
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Entregador</label>
          <select
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-500"
            value={selectedDelivererId}
            onChange={e => setSelectedDelivererId(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {availableDeliverers.map(deliverer => (
              <option key={deliverer.id} value={deliverer.id}>
                {deliverer.name} ({deliverer.phone})
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Criar Entrega
          </Button>
        </div>
      </form>
    </Modal>
  );
}
