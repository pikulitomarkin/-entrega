import { create } from 'zustand';
import type { User } from '../types';
import { db } from '../lib/firebase';
import { collection, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';

interface UserStore {
  users: User[];
  subscribeToUsers: () => () => void;
  approveUser: (id: string) => Promise<void>;
  rejectUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],

  subscribeToUsers: () => {
    const q = collection(db, 'users');
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const users = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
          } as User;
        });
        set({ users });
      },
      (error) => {
        console.error('Error fetching users:', error);
        set({ users: [] });
      }
    );
    return unsubscribe;
  },

  approveUser: async (id) => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, { status: 'approved' });
  },

  rejectUser: async (id) => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, { status: 'rejected' });
  },
}));
