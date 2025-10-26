import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Deliverer } from '../../types';

interface AssignDelivererModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverers: Deliverer[];
  onAssign: (delivererId: string) => void;
}

export default function AssignDelivererModal({ isOpen, onClose, deliverers, onAssign }: AssignDelivererModalProps) {
  const [selectedDeliverer, setSelectedDeliverer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverer) return;
    setIsLoading(true);
    onAssign(selectedDeliverer);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Atribuir Entregador">
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Selecione o entregador</label>
          <select
            className="w-full bg-dark-900 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
            value={selectedDeliverer}
            onChange={e => setSelectedDeliverer(e.target.value)}
            required
          >
            <option value="">-- Escolha --</option>
            {deliverers.filter(d => d.isAvailable).map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>Atribuir</Button>
        </div>
      </form>
    </Modal>
  );
}
