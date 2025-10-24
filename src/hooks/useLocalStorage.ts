import { useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';
import { useDeliveryStore } from '../store/deliveryStore';

const ORDER_STORAGE_KEY = 'oentrega-orders';
const DELIVERY_STORAGE_KEY = 'oentrega-deliveries';
const DELIVERER_STORAGE_KEY = 'oentrega-deliverers';

export function useLocalStoragePersistence() {
  const orders = useOrderStore(state => state.orders);
  const deliveries = useDeliveryStore(state => state.deliveries);
  const deliverers = useDeliveryStore(state => state.deliverers);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem(ORDER_STORAGE_KEY);
      const savedDeliveries = localStorage.getItem(DELIVERY_STORAGE_KEY);
      const savedDeliverers = localStorage.getItem(DELIVERER_STORAGE_KEY);

      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        parsedOrders.forEach((order: any) => {
          order.createdAt = new Date(order.createdAt);
          order.updatedAt = new Date(order.updatedAt);
          if (order.readyAt) order.readyAt = new Date(order.readyAt);
          useOrderStore.getState().addOrder(order);
        });
      }

      if (savedDeliveries) {
        const parsedDeliveries = JSON.parse(savedDeliveries);
        parsedDeliveries.forEach((delivery: any) => {
          delivery.createdAt = new Date(delivery.createdAt);
          if (delivery.pickupTime) delivery.pickupTime = new Date(delivery.pickupTime);
          if (delivery.deliveryTime) delivery.deliveryTime = new Date(delivery.deliveryTime);
          useDeliveryStore.getState().addDelivery(delivery);
        });
      }

      if (savedDeliverers) {
        const parsedDeliverers = JSON.parse(savedDeliverers);
        parsedDeliverers.forEach((deliverer: any) => {
          useDeliveryStore.getState().addDeliverer(deliverer);
        });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(deliveries));
    } catch (error) {
      console.error('Error saving deliveries to localStorage:', error);
    }
  }, [deliveries]);

  useEffect(() => {
    try {
      localStorage.setItem(DELIVERER_STORAGE_KEY, JSON.stringify(deliverers));
    } catch (error) {
      console.error('Error saving deliverers to localStorage:', error);
    }
  }, [deliverers]);
}
