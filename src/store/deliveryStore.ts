import { create } from 'zustand';
import type { Delivery, Deliverer, DeliveryStatus } from '../types';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, where, Timestamp } from 'firebase/firestore';

interface DeliveryStore {
  deliveries: Delivery[];
  deliverers: Deliverer[];
  subscribeToDeliveries: () => () => void;
  subscribeToDeliverers: () => () => void;
  addDelivery: (delivery: Omit<Delivery, 'id'>) => Promise<void>;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => Promise<void>;
  assignDeliverer: (deliveryId: string, delivererId: string) => Promise<void>;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  deliveries: [],
  deliverers: [],

  subscribeToDeliveries: () => {
    const q = collection(db, 'deliveries');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const deliveries = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderId: data.orderId,
          status: data.status,
          deliverer: data.deliverer,
          createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
          assignedAt: data.assignedAt ? (data.assignedAt as Timestamp).toDate() : undefined,
          pickupTime: data.pickupTime ? (data.pickupTime as Timestamp).toDate() : undefined,
          deliveryTime: data.deliveryTime ? (data.deliveryTime as Timestamp).toDate() : undefined,
        } as Delivery;
      });
      set({ deliveries });
    });
    return unsubscribe;
  },

  subscribeToDeliverers: () => {
    const q = query(collection(db, 'users'), where('role', '==', 'deliverer'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const deliverers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Deliverer));
      set({ deliverers });
    });
    return unsubscribe;
  },

  addDelivery: async (delivery) => {
    await addDoc(collection(db, 'deliveries'), delivery);
  },

  updateDeliveryStatus: async (id, status) => {
    const deliveryDoc = doc(db, 'deliveries', id);
    const updates: Partial<Delivery> = { status };
    if (status === 'picked_up') updates.pickupTime = new Date();
    if (status === 'delivered') updates.deliveryTime = new Date();
    await updateDoc(deliveryDoc, updates);
  },

  assignDeliverer: async (deliveryId, delivererId) => {
    const deliveryDoc = doc(db, 'deliveries', deliveryId);
    await updateDoc(deliveryDoc, { 
      delivererId,
      status: 'assigned',
      assignedAt: new Date(),
    });
  },
}));
