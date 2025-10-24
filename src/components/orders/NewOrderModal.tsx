import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema } from '../../validation/orderSchema';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useOrderStore } from '../../store/orderStore';
import { OrderStatus } from '../../types';
import { generateId } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export default function NewOrderModal({ isOpen, onClose }: NewOrderModalProps) {
  const addOrder = useOrderStore(state => state.addOrder);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      orderNotes: '',
      items: [{ name: '', quantity: 1, price: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleAddItem = () => {
    append({ name: '', quantity: 1, price: 0 });
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const newOrder = {
        id: generateId(),
        customer: {
          id: generateId(),
          name: data.customerName,
          phone: data.customerPhone,
          address: data.customerAddress || undefined,
          createdAt: new Date(),
        },
        items: data.items,
        total: calculateTotal(data.items),
        status: OrderStatus.PENDING,
        notes: data.orderNotes || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'manual' as const,
      };
      addOrder(newOrder);
      toast.success('Pedido criado com sucesso!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Erro ao criar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Pedido" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Customer Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Informações do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="customerName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Nome do Cliente *"
                  placeholder="Digite o nome"
                  {...field}
                  error={errors.customerName?.message as string}
                  required
                />
              )}
            />
            <Controller
              name="customerPhone"
              control={control}
              render={({ field }) => (
                <Input
                  label="Telefone *"
                  placeholder="(11) 99999-9999"
                  {...field}
                  error={errors.customerPhone?.message as string}
                  required
                />
              )}
            />
          </div>
          <div className="mt-4">
            <Controller
              name="customerAddress"
              control={control}
              render={({ field }) => (
                <Input
                  label="Endereço de Entrega"
                  placeholder="Rua, número, bairro"
                  {...field}
                  error={errors.customerAddress?.message as string}
                />
              )}
            />
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Itens do Pedido</h3>
            <Button type="button" size="sm" onClick={handleAddItem}>
              <Plus className="w-4 h-4" />
              Adicionar Item
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((item, index) => (
              <div key={`${item.id}-${index}`} className="bg-dark-800 rounded-xl p-4 border border-dark-700">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <Controller
                      name={`items.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Nome do item"
                          {...field}
                          error={errors.items?.[index]?.name?.message as string}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          min="1"
                          placeholder="Qtd"
                          {...field}
                          error={errors.items?.[index]?.quantity?.message as string}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <Controller
                      name={`items.${index}.price`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Preço"
                          {...field}
                          error={errors.items?.[index]?.price?.message as string}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Notes */}
        <div>
          <Controller
            name="orderNotes"
            control={control}
            render={({ field }) => (
              <textarea
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white placeholder-dark-400 focus:outline-none focus:border-accent-500 transition-colors resize-none"
                rows={3}
                placeholder="Observações sobre o pedido..."
                {...field}
                // error={errors.orderNotes?.message as string}
              />
            )}
          />
        </div>

        {/* Total */}
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-bold text-accent-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(calculateTotal(fields))}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Criar Pedido
          </Button>
        </div>
      </form>
    </Modal>
  );
}
