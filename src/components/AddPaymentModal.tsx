import React, { useState, useEffect } from 'react';
import { Button, Input, Dropdown, DatePicker } from './ui';
import { useAppSelector } from '../store/hooks';
import { paymentService } from '../services/paymentService';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddPaymentData) => Promise<void>;
}

export interface AddPaymentData {
  customerId: string;
  customerName: string;
  paymentDate: string;
  amount: number;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data: customers } = useAppSelector((state) => state.customers);
  
  const [formData, setFormData] = useState<AddPaymentData>({
    customerId: '',
    customerName: '',
    paymentDate: '',
    amount: 0
  });

  // Local state for input display (to show empty strings instead of 0)
  const [inputValues, setInputValues] = useState({
    amount: ''
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      // Reset form data
      setFormData({
        customerId: '',
        customerName: '',
        paymentDate: '',
        amount: 0
      });
      // Reset input display values
      setInputValues({
        amount: ''
      });
    }, 0);
  };

  const handleInputChange = (field: keyof AddPaymentData, value: string | number) => {
    if (field === 'customerId' || field === 'customerName' || field === 'paymentDate') {
      // Handle string fields directly
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
      if (field === 'amount') {
        setInputValues(prev => ({
          ...prev,
          [field]: typeof value === 'string' ? value : value.toString()
        }));
      }
    }
  };

  const handleDateChange = (value: string) => {
    // Convert yyyy-mm-dd to dd-mm-yyyy format
    if (value) {
      const [year, month, day] = value.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      handleInputChange('paymentDate', formattedDate);
    } else {
      handleInputChange('paymentDate', '');
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers.find(customer => customer.id === customerId);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerId && formData.paymentDate && formData.amount > 0) {
      setIsSaving(true);
      try {
        // Call the onSave callback with the form data
        await onSave(formData);
        
        console.log('Payment saved successfully');
      } catch (error) {
        console.error('Failed to save payment:', error);
        // You can add error handling here (e.g., show a toast notification)
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-lg shadow-strong px-xl pt-xl py-lg pb-lg w-full transform transition-transform duration-500 ease-out animate-slide-up">
        <div className="flex justify-between items-center mb-lg">
          <h2 className="text-xl font-bold text-secondary-900">Add Payment</h2>
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
          {/* Customer Dropdown */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-sm">
              Customer
            </label>
                         <Dropdown
               options={customers.map(customer => ({
                 value: customer.id,
                 label: customer.name
               }))}
               value={formData.customerId}
               onValueChange={handleCustomerSelect}
               placeholder="Select customer"
               enableSearch={true}
             />
          </div>

          {/* Date */}
          <div>
            <DatePicker
              value={formData.paymentDate ? formData.paymentDate.split('-').reverse().join('-') : ''}
              onChange={handleDateChange}
              label="Payment Date"
              placeholder="Select date"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-sm">
              Amount
            </label>
            <Input
              type="number"
              value={inputValues.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Enter amount"
              required
              min="0"
              step="0.01"
            />
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
               disabled={!formData.customerId || !formData.paymentDate || formData.amount <= 0 || isSaving}
             >
               {isSaving ? 'Saving...' : 'Add Payment'}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal; 