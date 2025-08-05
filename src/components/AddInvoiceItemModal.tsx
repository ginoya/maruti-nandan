import React, { useState, useEffect } from 'react';
import { Button, Input } from './ui';

interface AddInvoiceItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddInvoiceItemData) => void;
}

export interface AddInvoiceItemData {
  particular: string;
  jodi: number;
  box: number;
  jodiTotal: number;
  rate: number;
  amount: number;
}

const AddInvoiceItemModal: React.FC<AddInvoiceItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  
  const [formData, setFormData] = useState<AddInvoiceItemData>({
    particular: '',
    jodi: 0,
    box: 0,
    jodiTotal: 0,
    rate: 0,
    amount: 0
  });

  // Local state for input display (to show empty strings instead of 0)
  const [inputValues, setInputValues] = useState({
    jodi: '',
    box: '',
    rate: ''
  });

  // Auto-calculate jodiTotal when jodi or box changes
  useEffect(() => {
    const jodiTotal = formData.jodi * formData.box;
    setFormData(prev => ({
      ...prev,
      jodiTotal
    }));
  }, [formData.jodi, formData.box]);

  // Auto-calculate amount when jodiTotal or rate changes
  useEffect(() => {
    const amount = formData.jodiTotal * formData.rate;
    setFormData(prev => ({
      ...prev,
      amount
    }));
  }, [formData.jodiTotal, formData.rate]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      // Reset form data
      setFormData({
        particular: '',
        jodi: 0,
        box: 0,
        jodiTotal: 0,
        rate: 0,
        amount: 0
      });
      // Reset input display values
      setInputValues({
        jodi: '',
        box: '',
        rate: ''
      });
    }, 0);
  };

  const handleInputChange = (field: keyof AddInvoiceItemData, value: string | number) => {
    if (field === 'particular') {
      // Handle string field directly
      setFormData(prev => ({
        ...prev,
        [field]: String(value)
      }));
    } else {
      // Handle numeric fields
      const numericValue = typeof value === 'string' ? (value === '' ? 0 : Number(value)) : value;
      
      setFormData(prev => ({
        ...prev,
        [field]: numericValue
      }));

      // Update input display values for numeric fields
      if (field === 'jodi' || field === 'box' || field === 'rate') {
        setInputValues(prev => ({
          ...prev,
          [field]: typeof value === 'string' ? value : value.toString()
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
           {/* Particular */}
           <div>
             <label className="block text-sm font-medium text-secondary-700 mb-sm">
               Particular
             </label>
             <Input
               type="text"
               value={formData.particular}
               onChange={(e) => handleInputChange('particular', e.target.value)}
               placeholder="Enter particular"
               required
             />
           </div>

           {/* Jodi, Box, and Jodi Total in same line */}
           <div className="grid grid-cols-3 gap-md">
             <div>
               <label className="block text-sm font-medium text-secondary-700 mb-sm">
                 Jodi
               </label>
                               <Input
                  type="number"
                  value={inputValues.jodi}
                  onChange={(e) => handleInputChange('jodi', e.target.value)}
                  placeholder="Enter jodi"
                  required
                />
             </div>

             <div>
               <label className="block text-sm font-medium text-secondary-700 mb-sm">
                 Box
               </label>
                               <Input
                  type="number"
                  value={inputValues.box}
                  onChange={(e) => handleInputChange('box', e.target.value)}
                  placeholder="Enter box"
                  required
                />
             </div>

             <div>
               <label className="block text-sm font-medium text-secondary-700 mb-sm">
                 Jodi Total
               </label>
               <Input
                 type="number"
                 value={formData.jodiTotal}
                 disabled
                 className="bg-gray-100 cursor-not-allowed"
                 placeholder="Auto-calculated"
               />
             </div>
           </div>

           {/* Rate and Amount in same line */}
           <div className="grid grid-cols-2 gap-md">
             <div>
               <label className="block text-sm font-medium text-secondary-700 mb-sm">
                 Rate
               </label>
                               <Input
                  type="number"
                  value={inputValues.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  placeholder="Enter rate"
                  required
                />
             </div>

             <div>
               <label className="block text-sm font-medium text-secondary-700 mb-sm">
                 Amount
               </label>
               <Input
                 type="number"
                 value={formData.amount}
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