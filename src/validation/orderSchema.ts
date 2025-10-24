import { z } from 'zod';

export const orderItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome do item obrigatório'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  price: z.number().min(0.01, 'Preço deve ser maior que 0'),
  notes: z.string().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(1, 'Nome obrigatório'),
  customerPhone: z.string().min(8, 'Telefone obrigatório'),
  customerAddress: z.string().optional(),
  orderNotes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Adicione pelo menos um item válido'),
});
