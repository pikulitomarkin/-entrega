import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocalStoragePersistence } from './hooks/useLocalStorage';
import { useOrderStore } from './store/orderStore';
import { mockOrders } from './lib/mockData';

interface AppWrapperProps {
  children: ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  useLocalStoragePersistence();
  useEffect(() => {
    // Carregar dados do localStorage ou usar mock data
    const savedOrders = localStorage.getItem('oentrega-orders');

    if (!savedOrders || JSON.parse(savedOrders).length === 0) {
      // Primeira vez rodando, carregar dados mock
      mockOrders.forEach(order => {
        useOrderStore.getState().addOrder(order);
      });
    } else {
      // Carregar dados salvos
      const orders = JSON.parse(savedOrders);
      orders.forEach((order: any) => {
        order.createdAt = new Date(order.createdAt);
        order.updatedAt = new Date(order.updatedAt);
        if (order.readyAt) order.readyAt = new Date(order.readyAt);
        useOrderStore.getState().addOrder(order);
      });
    }
  }, []);

  // Salvar no localStorage quando dados mudarem
  const orders = useOrderStore(state => state.orders);
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('oentrega-orders', JSON.stringify(orders));
    }
  }, [orders]);

  return <>{children}</>;
}
