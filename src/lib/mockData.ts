import type { Order, Customer, OrderItem } from '../types';
import { OrderStatus } from '../types';
import { generateId } from '../utils/formatters';

// Dados de exemplo para desenvolvimento
export const mockCustomers: Customer[] = [
  {
    id: generateId(),
    name: 'João Silva',
    phone: '11987654321',
    address: 'Rua das Flores, 123',
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Maria Santos',
    phone: '11976543210',
    address: 'Av. Principal, 456',
    createdAt: new Date()
  }
];

export const mockOrderItems: OrderItem[] = [
  {
    id: generateId(),
    name: 'Pizza Margherita',
    quantity: 2,
    price: 45.00,
    notes: 'Sem cebola'
  },
  {
    id: generateId(),
    name: 'Refrigerante 2L',
    quantity: 1,
    price: 10.00
  }
];

export const mockOrders: Order[] = [
  {
    id: generateId(),
    customer: mockCustomers[0],
    items: [mockOrderItems[0], mockOrderItems[1]],
    total: 100.00,
    status: OrderStatus.PENDING,
    notes: 'Entregar antes das 20h',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
    source: 'whatsapp'
  },
  {
    id: generateId(),
    customer: mockCustomers[1],
    items: [mockOrderItems[0]],
    total: 90.00,
    status: OrderStatus.PREPARING,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
    source: 'manual'
  },
  {
    id: generateId(),
    customer: mockCustomers[0],
    items: [mockOrderItems[1]],
    total: 10.00,
    status: OrderStatus.READY,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    readyAt: new Date(Date.now() - 1000 * 60 * 5),
    source: 'phone'
  }
];
