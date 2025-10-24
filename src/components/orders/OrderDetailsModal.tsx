import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Order } from '../../types';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalhes do Pedido #${order.id.slice(0, 8)}`} size="lg">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Cliente</h3>
          <div className="space-y-1">
            <p><span className="font-medium text-dark-300">Nome:</span> {order.customer.name}</p>
            <p><span className="font-medium text-dark-300">Telefone:</span> {formatPhone(order.customer.phone)}</p>
            {order.customer.address && (
              <p><span className="font-medium text-dark-300">Endereço:</span> {order.customer.address}</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Itens do Pedido</h3>
          <ul className="space-y-2">
            {order.items.map(item => (
              <li key={item.id} className="flex justify-between text-dark-300">
                <span>{item.quantity}x {item.name}</span>
                <span>{formatCurrency(item.price)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Informações</h3>
          <p><span className="font-medium text-dark-300">Status:</span> {order.status}</p>
          <p><span className="font-medium text-dark-300">Criado em:</span> {formatDate(order.createdAt)}</p>
          <p><span className="font-medium text-dark-300">Atualizado em:</span> {formatDate(order.updatedAt)}</p>
          {order.notes && (
            <p><span className="font-medium text-dark-300">Observações:</span> {order.notes}</p>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
}
