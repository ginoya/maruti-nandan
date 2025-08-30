import React, { useState, useEffect } from 'react';
import { Button, Dropdown, DatePicker, Input } from './ui';
import { usePedhis } from '../hooks/usePedhis';
import { useCustomers } from '../hooks/useCustomers';
import { formatDateToYYYYMMDD, formatDateToDDMMYYYY, getTodayDate } from '../utils/dateUtils';

interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditInvoiceData) => void;
  initialData?: EditInvoiceData;
}

export interface EditInvoiceData {
  business: string;
  customer: string;
  date: string;
  invoiceNo?: string;
}

const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const [isClosing,] = useState(false);
  
  // Get today's date in DD-MM-YYYY format (invoice format)
  const getTodayInvoiceDate = () => {
    return getTodayDate();
  };

  const [formData, setFormData] = useState<EditInvoiceData>({
    business: initialData?.business || '',
    customer: initialData?.customer || '',
    date: initialData?.date || getTodayInvoiceDate(),
    invoiceNo: initialData?.invoiceNo || ''
  });

  // Get pedhis data from Redux
  const { pedhis, loading: pedhisLoading } = usePedhis();

  const { customers } = useCustomers();

  // Transform pedhis data to dropdown options format
  const businesses = pedhis.map((pedhi: any) => ({
    value: pedhi.displayName,
    label: pedhi.displayName
  }));


  // Set default business selection when pedhis are loaded
  useEffect(() => {
    if (pedhis.length > 0 && !formData.business) {
      setFormData(prev => ({
        ...prev,
        business: pedhis[0].displayName
      }));
    }
  }, [pedhis, formData.business]);

  // Ensure date is always set to today's date when no valid date is provided
  useEffect(() => {
    if (!formData.date || formData.date === '' || formData.date === '00-undefined-undefined' || formData.date === "undefined-undefined-00") {
      setFormData(prev => ({
        ...prev,
        date: getTodayInvoiceDate()
      }));
    }
  }, [formData.date]);

  const handleClose = () => {
    onClose();
    // Match animation duration
  };

  // Show loading or empty state for businesses
  if (pedhisLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-black/50 flex items-end justify-center z-50">
               <div className={`bg-white rounded-t-lg shadow-strong px-xl pt-xl pb-lg w-full transform transition-transform duration-500 ease-out ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
         <div className="text-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-md"></div>
           <p className="text-secondary-600">Loading businesses...</p>
         </div>
       </div>
      </div>
    );
  }

  // Show error state if no businesses are available
  if (businesses.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-black/50 flex items-end justify-center z-50">
               <div className={`bg-white rounded-t-lg shadow-strong px-xl pt-xl pb-lg w-full transform transition-transform duration-500 ease-out ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
         <div className="text-center">
           <p className="text-red-600 mb-md">No businesses available</p>
           <Button
             type="button"
             variant="outline"
             onClick={handleClose}
           >
             Close
           </Button>
         </div>
       </div>
      </div>
    );
  }

  // const customers = [
  //   { value: 'gng', label: 'GNG' },
  //   { value: 'abc-company', label: 'ABC Company' },
  //   { value: 'xyz-corporation', label: 'XYZ Corporation' },
  //   { value: 'def-limited', label: 'DEF Limited' }
  // ];

  const handleInputChange = (field: keyof EditInvoiceData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  console.log('forma',formData)

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
          <h2 className="text-xl font-bold text-secondary-900">Edit Invoice Details</h2>
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
          {/* Business Dropdown - No Search */}
          {
            businesses && businesses.length > 1 && (
              <Dropdown
            options={businesses}
            value={formData.business}
            onValueChange={(value) => handleInputChange('business', value)}
            label="Business"
            placeholder={pedhisLoading ? "Loading businesses..." : "Select Business"}
            enableSearch={false}
          />
            )
          }
          

          {/* Customer Dropdown - With Search */}
          <Dropdown
            options={customers.map((customer: any)=>({
              value: customer.name,
              label: customer.name
            }))}
            value={formData.customer}
            onValueChange={(value) => handleInputChange('customer', value)}
            label="Customer"
            placeholder="Select Customer"
            enableSearch={true}
          />

          {/* Invoice Number - Optional */}
          <Input
            type="text"
            label="Invoice Number (Optional)"
            placeholder="Enter custom invoice number or leave empty for auto-generated"
            value={formData.invoiceNo}
            onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
            // helperText="Leave empty to use auto-generated invoice number"
          />

          {/* Date */}
          <DatePicker
            value={formData.date ? formatDateToYYYYMMDD(formData.date) : ''}
            onChange={(value) => handleInputChange('date', formatDateToDDMMYYYY(value))}
            label="Date"
            placeholder="Select date"
          />

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
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInvoiceModal; 