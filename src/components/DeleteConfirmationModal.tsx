import React from 'react';
import { Button } from './ui';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-lg shadow-strong px-xl pt-xl py-lg pb-lg w-full transform transition-transform duration-500 ease-out animate-slide-up">
        <div className="flex justify-between items-center mb-lg">
          <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-lg">
          <p className="text-secondary-700">{message}</p>

          <div className="flex justify-between pt-xl" style={{paddingTop: '10px'}}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              size='sm'
              disabled={isLoading}
            >
              No, Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              onClick={onConfirm}
              size='sm'
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 