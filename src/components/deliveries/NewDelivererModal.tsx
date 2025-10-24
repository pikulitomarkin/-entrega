import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { delivererSchema } from '../../validation/delivererSchema';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useDeliveryStore } from '../../store/deliveryStore';
import { generateId } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface NewDelivererModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewDelivererModal({ isOpen, onClose }: NewDelivererModalProps) {
  const addDeliverer = useDeliveryStore(state => state.addDeliverer);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(delivererSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const newDeliverer = {
        id: generateId(),
        name: data.name,
        phone: data.phone,
        isAvailable: true,
        currentDeliveries: 0,
      };
      addDeliverer(newDeliverer);
      toast.success('Entregador adicionado com sucesso!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Erro ao adicionar entregador');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Entregador" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              label="Nome do Entregador *"
              placeholder="Digite o nome"
              {...field}
              error={errors.name?.message as string}
              required
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              label="Telefone *"
              placeholder="(11) 99999-9999"
              {...field}
              error={errors.phone?.message as string}
              required
            />
          )}
        />
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Adicionar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
