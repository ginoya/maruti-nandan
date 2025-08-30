import React, { useState, useEffect } from 'react';
import { Button, Input } from './ui';

interface AddInvoiceItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddInvoiceItemData) => void;
}

export interface AddInvoiceItemData {
  date: string;
  geru: number;
  white: number;
  jaipuri: number;
  damar: number;
  gold: number;
  total: number;
}

const AddInvoiceItemModal: React.FC<AddInvoiceItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  
  const [formData, setFormData] = useState<AddInvoiceItemData>({
    date: new Date().toISOString().split('T')[0],
    geru: 0,
    white: 0,
    jaipuri: 0,
    damar: 0,
    gold: 0,
    total: 0
  });

  // Local state for input display (to show empty strings instead of 0)
  const [inputValues, setInputValues] = useState({
    geru: '',
    white: '',
    jaipuri: '',
    damar: '',
    gold: ''
  });

  // Auto-calculate total when category fields change
  useEffect(() => {
    const total = (formData.geru || 0) + (formData.white || 0) + (formData.jaipuri || 0) + (formData.damar || 0) + (formData.gold || 0);
    setFormData(prev => ({
      ...prev,
      total
    }));
  }, [formData.geru, formData.white, formData.jaipuri, formData.damar, formData.gold]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      // Reset form data
      setFormData({
        date: new Date().toISOString().split('T')[0],
        geru: 0,
        white: 0,
        jaipuri: 0,
        damar: 0,
        gold: 0,
        total: 0
      });
      // Reset input display values
      setInputValues({
        geru: '',
        white: '',
        jaipuri: '',
        damar: '',
        gold: ''
      });
    }, 0);
  };

  const handleInputChange = (field: keyof AddInvoiceItemData, value: string | number) => {
    if (field === 'date') {
      setFormData(prev => ({
        ...prev,
        date: String(value)
      }));
    } else {
      // Handle numeric fields
      let numericValue: number;
      
      if (typeof value === 'string') {
        if (value === '' || value === '.') {
          numericValue = 0;
        } else {
          // Handle decimal values properly
          numericValue = parseFloat(value) || 0;
        }
      } else {
        numericValue = value;
      }
      
      setFormData(prev => ({
        ...prev,
        [field]: numericValue
      }));

      // Update input display values for numeric fields
      if (field === 'geru' || field === 'white' || field === 'jaipuri' || field === 'damar' || field === 'gold') {
        setInputValues(prev => ({
          ...prev,
          [field]: typeof value === 'string' ? value : value.toString()
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure at least one category is provided
    const hasAny = [formData.geru, formData.white, formData.jaipuri, formData.damar, formData.gold].some(v => (v || 0) > 0);
    if (!hasAny) return;

    onSave(formData);
    handleClose();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-lg shadow-strong px-xl pt-xl py-lg pb-lg w-full transform transition-transform duration-500 ease-out animate-slide-up">
        <div className="flex justify-between items-center mb-lg">
          <h2 className="text-xl font-bold text-secondary-900">Add Invoice Item</h2>
          <button
            onClick={handleClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-sm">
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          {/* Category inputs and Total */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Geru</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={inputValues.geru}
                onChange={(e) => handleInputChange('geru', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e as any);} }}
                placeholder="Enter geru"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">White</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={inputValues.white}
                onChange={(e) => handleInputChange('white', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e as any);} }}
                placeholder="Enter white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Jaipuri</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={inputValues.jaipuri}
                onChange={(e) => handleInputChange('jaipuri', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e as any);} }}
                placeholder="Enter jaipuri"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Damar</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={inputValues.damar}
                onChange={(e) => handleInputChange('damar', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e as any);} }}
                placeholder="Enter damar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Gold</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={inputValues.gold}
                onChange={(e) => handleInputChange('gold', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e as any);} }}
                placeholder="Enter gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-sm">Total</label>
              <Input
                type="number"
                value={formData.total}
                disabled
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Auto-calculated"
              />
            </div>
          </div>

         {/* Action Buttons */}
          <div className="flex justify-between pt-md">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              size='sm'
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size='sm'
              className='px-xl'
            >
              Add Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceItemModal; 