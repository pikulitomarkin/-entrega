import { OrderStatus, DeliveryStatus } from '../types';

export const getOrderStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pendente',
    [OrderStatus.PREPARING]: 'Em Preparo',
    [OrderStatus.READY]: 'Pronto',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
    [OrderStatus.DELIVERED]: 'Entregue',
    [OrderStatus.CANCELLED]: 'Cancelado'
  };
  return labels[status];
};

export const getOrderStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    [OrderStatus.PREPARING]: 'bg-blue-100 text-blue-800 border-blue-300',
    [OrderStatus.READY]: 'bg-green-100 text-green-800 border-green-300',
    [OrderStatus.OUT_FOR_DELIVERY]: 'bg-purple-100 text-purple-800 border-purple-300',
    [OrderStatus.DELIVERED]: 'bg-gray-100 text-gray-800 border-gray-300',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[status];
};

export const getDeliveryStatusLabel = (status: DeliveryStatus): string => {
  const labels: Record<DeliveryStatus, string> = {
    [DeliveryStatus.WAITING]: 'Aguardando',
    [DeliveryStatus.ASSIGNED]: 'Atribuído',
    [DeliveryStatus.PICKED_UP]: 'Coletado',
    [DeliveryStatus.IN_TRANSIT]: 'Em Trânsito',
    [DeliveryStatus.DELIVERED]: 'Entregue'
  };
  return labels[status];
};

export const getDeliveryStatusColor = (status: DeliveryStatus): string => {
  const colors: Record<DeliveryStatus, string> = {
    [DeliveryStatus.WAITING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    [DeliveryStatus.ASSIGNED]: 'bg-blue-100 text-blue-800 border-blue-300',
    [DeliveryStatus.PICKED_UP]: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    [DeliveryStatus.IN_TRANSIT]: 'bg-purple-100 text-purple-800 border-purple-300',
    [DeliveryStatus.DELIVERED]: 'bg-green-100 text-green-800 border-green-300'
  };
  return colors[status];
};
