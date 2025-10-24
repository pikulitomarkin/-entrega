import { z } from 'zod';

export const delivererSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  phone: z.string().min(8, 'Telefone obrigatório'),
});
