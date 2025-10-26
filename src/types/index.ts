// Status do pedido
export const OrderStatus = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

// Status da entrega
export const DeliveryStatus = {
  WAITING: 'waiting',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered'
} as const;

export type DeliveryStatus = typeof DeliveryStatus[keyof typeof DeliveryStatus];

// Types para usuários/roles
export type UserRole = 'admin' | 'deliverer' | 'customer';
export type UserStatus = 'pending' | 'approved' | 'rejected';

// Interface do Usuário
export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  name?: string;
  phone?: string;
  status?: UserStatus;
  createdAt: Date;
}

// Interface do Cliente
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  createdAt: Date;
}

// Interface do Item do Pedido
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

// Interface do Pedido
export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  readyAt?: Date;
  deliveryId?: string;
  source: 'manual' | 'whatsapp' | 'phone';
}

// Interface do Entregador
export interface Deliverer {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  currentDeliveries: number;
}

// Interface da Entrega
export interface Delivery {
  id: string;
  orderId: string;
  deliverer?: Deliverer;
  status: DeliveryStatus;
  pickupTime?: Date;
  deliveryTime?: Date;
  createdAt: Date;
}

// Interface da mensagem do WhatsApp
export interface WhatsAppMessage {
  id: string;
  from: string;
  body: string;
  timestamp: Date;
  isProcessed: boolean;
  extractedOrder?: Partial<Order>;
}
