import { motion } from 'framer-motion';
import { X, Trash2, Loader2 } from 'lucide-react';
import { Product } from '../../../../lib/types';
import { Button } from '../../../../components/ui/button';


interface DeleteConfirmationModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteConfirmationModal = ({
  product,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmationModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Подтвердите удаление</h3>
            <p className="text-gray-600 mt-1">
              Вы уверены, что хотите удалить товар <span className="font-medium">"{product.name}"</span>?
            </p>
            <p className="text-sm text-rose-600 mt-2">Это действие нельзя отменить!</p>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Удаление...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Удалить</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};