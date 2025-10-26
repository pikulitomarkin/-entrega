import { create } from 'zustand';
import type { Order, OrderStatus } from '../types';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

interface OrderStore {
  orders: Order[];
  subscribeToOrders: () => () => void; // Returns an unsubscribe function
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],

  subscribeToOrders: () => {
    const q = collection(db, 'orders');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined,
          readyAt: data.readyAt ? (data.readyAt as Timestamp).toDate() : undefined,
        } as Order;
      });
      set({ orders });
    });
    return unsubscribe;
  },

  addOrder: async (order) => {
    await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  updateOrder: async (id, updates) => {
    const orderDoc = doc(db, 'orders', id);
    await updateDoc(orderDoc, { ...updates, updatedAt: new Date() });
  },

  updateOrderStatus: async (id, status) => {
    const orderDoc = doc(db, 'orders', id);
    await updateDoc(orderDoc, { status, updatedAt: new Date() });
  },

  deleteOrder: async (id) => {
    const orderDoc = doc(db, 'orders', id);
    await deleteDoc(orderDoc);
  },
}));
