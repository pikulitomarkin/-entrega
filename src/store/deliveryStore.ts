import { create } from 'zustand';
import type { Delivery, Deliverer, DeliveryStatus } from '../types';
import { DeliveryStatus as DeliveryStatusEnum } from '../types';

interface DeliveryStore {
  deliveries: Delivery[];
  deliverers: Deliverer[];
  addDelivery: (delivery: Delivery) => void;
  updateDelivery: (id: string, updates: Partial<Delivery>) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => void;
  assignDeliverer: (deliveryId: string, deliverer: Deliverer) => void;
  getDeliveryByOrderId: (orderId: string) => Delivery | undefined;
  addDeliverer: (deliverer: Deliverer) => void;
  updateDeliverer: (id: string, updates: Partial<Deliverer>) => void;
  getAvailableDeliverers: () => Deliverer[];
}

export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  deliveries: [],
  deliverers: [],

  addDelivery: (delivery) => set((state) => ({
    deliveries: [...state.deliveries, delivery]
  })),

  updateDelivery: (id, updates) => set((state) => ({
    deliveries: state.deliveries.map(delivery =>
      delivery.id === id ? { ...delivery, ...updates } : delivery
    )
  })),

  updateDeliveryStatus: (id, status) => set((state) => ({
    deliveries: state.deliveries.map(delivery =>
      delivery.id === id
        ? {
            ...delivery,
            status,
            pickupTime: status === DeliveryStatusEnum.PICKED_UP && !delivery.pickupTime
              ? new Date()
              : delivery.pickupTime,
            deliveryTime: status === DeliveryStatusEnum.DELIVERED
              ? new Date()
              : delivery.deliveryTime
          }
        : delivery
    )
  })),

  assignDeliverer: (deliveryId, deliverer) => set((state) => ({
    deliveries: state.deliveries.map(delivery =>
      delivery.id === deliveryId
        ? { ...delivery, deliverer, status: DeliveryStatusEnum.ASSIGNED }
        : delivery
    ),
    deliverers: state.deliverers.map(d =>
      d.id === deliverer.id
        ? { ...d, currentDeliveries: d.currentDeliveries + 1 }
        : d
    )
  })),

  getDeliveryByOrderId: (orderId) => {
    return get().deliveries.find(delivery => delivery.orderId === orderId);
  },

  addDeliverer: (deliverer) => set((state) => ({
    deliverers: [...state.deliverers, deliverer]
  })),

  updateDeliverer: (id, updates) => set((state) => ({
    deliverers: state.deliverers.map(deliverer =>
      deliverer.id === id ? { ...deliverer, ...updates } : deliverer
    )
  })),

  getAvailableDeliverers: () => {
    return get().deliverers.filter(d => d.isAvailable && d.currentDeliveries < 3);
  }
}));
