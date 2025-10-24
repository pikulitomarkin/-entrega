import { create } from 'zustand';
import type { Order, OrderStatus } from '../types';
import { OrderStatus as OrderStatusEnum } from '../types';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  addOrder: (order) => set((state) => ({
    orders: [...state.orders, order]
  })),

  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map(order =>
      order.id === id
        ? { ...order, ...updates, updatedAt: new Date() }
        : order
    )
  })),

  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(order =>
      order.id === id
        ? {
            ...order,
            status,
            updatedAt: new Date(),
            readyAt: status === OrderStatusEnum.READY ? new Date() : order.readyAt
          }
        : order
    )
  })),

  deleteOrder: (id) => set((state) => ({
    orders: state.orders.filter(order => order.id !== id)
  })),

  getOrderById: (id) => {
    return get().orders.find(order => order.id === id);
  },

  getOrdersByStatus: (status) => {
    return get().orders.filter(order => order.status === status);
  }
}));
