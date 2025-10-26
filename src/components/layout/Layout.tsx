import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useOrderStore } from '../../store/orderStore';
import { useDeliveryStore } from '../../store/deliveryStore';
import { useUserStore } from '../../store/userStore';

export default function Layout() {
  const { user, loading } = useAuth();
  const { subscribeToOrders } = useOrderStore();
  const { subscribeToDeliveries, subscribeToDeliverers } = useDeliveryStore();
  const { subscribeToUsers } = useUserStore();

  useEffect(() => {
    if (!loading && user) {
      const unsubOrders = subscribeToOrders();
      const unsubDeliveries = subscribeToDeliveries();
      const unsubDeliverers = subscribeToDeliverers();
      let unsubUsers: (() => void) | undefined;

      if (user.role === 'admin') {
        unsubUsers = subscribeToUsers();
      }

      return () => {
        try {
          unsubOrders();
        } catch (error) {
          console.debug('Error unsubscribing from orders:', error);
        }
        try {
          unsubDeliveries();
        } catch (error) {
          console.debug('Error unsubscribing from deliveries:', error);
        }
        try {
          unsubDeliverers();
        } catch (error) {
          console.debug('Error unsubscribing from deliverers:', error);
        }
        if (unsubUsers) {
          try {
            unsubUsers();
          } catch (error) {
            console.debug('Error unsubscribing from users:', error);
          }
        }
      };
    }
  }, [user, loading]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
