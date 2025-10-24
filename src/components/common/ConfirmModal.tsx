import Modal from './Modal';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', isLoading = false }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-6 space-y-4">
        {description && <p className="text-dark-300 text-sm">{description}</p>}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            {cancelLabel}
          </Button>
          <Button type="button" variant="primary" onClick={onConfirm} isLoading={isLoading} className="flex-1">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
