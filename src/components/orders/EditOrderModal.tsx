import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import type { OrderItem, Order } from '../../types';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid'; // Adicione esta importação para gerar IDs únicos

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSave: (order: Order) => void;
}

export default function EditOrderModal({ isOpen, onClose, order, onSave }: EditOrderModalProps) {
  const [customerName, setCustomerName] = useState(order.customer.name);
  const [customerPhone, setCustomerPhone] = useState(order.customer.phone);
  const [customerAddress, setCustomerAddress] = useState(order.customer.address || '');
  const [orderNotes, setOrderNotes] = useState(order.notes || '');
  const [items, setItems] = useState<OrderItem[]>(order.items);
  const [isLoading, setIsLoading] = useState(false);

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!customerName || !customerPhone) {
      toast.error('Preencha nome e telefone do cliente');
      setIsLoading(false);
      return;
    }
    const validItems = items.filter(item => item.name && item.quantity > 0 && item.price > 0);
    if (validItems.length === 0) {
      toast.error('Adicione pelo menos um item válido');
      setIsLoading(false);
      return;
    }
    const updatedOrder: Order = {
      ...order,
      customer: {
        ...order.customer,
        name: customerName,
        phone: customerPhone,
        address: customerAddress || undefined,
      },
      notes: orderNotes,
      items: validItems,
      total: validItems.reduce((sum, item) => sum + (item.quantity * item.price), 0),
    };
    onSave(updatedOrder);
    toast.success('Pedido atualizado!');
    setIsLoading(false);
    onClose();
  };

  // Função para adicionar um novo item
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: uuidv4(),
        name: '',
        quantity: 1,
        price: 0,
      }
    ]);
  };

  // Função para remover um item
  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Pedido">
      <form onSubmit={handleSave} className="space-y-4">
        <Input label="Nome do Cliente" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
        <Input label="Telefone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
        <Input label="Endereço" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
        <Input label="Observações" value={orderNotes} onChange={e => setOrderNotes(e.target.value)} />
        {/* Renderização dos itens do pedido */}
        {items.map(item => (
          <div key={item.id} className="flex gap-2 items-center">
            <Input label="Item" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} required />
            <Input label="Qtd" type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} required />
            <Input label="Preço" type="number" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} required />
            <Button type="button" variant="danger" onClick={() => handleRemoveItem(item.id)}>Remover</Button>
          </div>
        ))}
        <Button type="button" variant="primary" onClick={handleAddItem}>Adicionar Item</Button>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
