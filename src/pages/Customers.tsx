import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Button, Input } from '../components/ui';
import { addCustomer } from '../services/customerService';
import { useCustomers } from '../hooks/useCustomers';
import { useAppDispatch } from '../store/hooks';
import { addCustomerToState } from '../store/customersSlice';

const Customers: React.FC = () => {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { customers, loading: customersLoading, error } = useCustomers();
  const dispatch = useAppDispatch();

  const handleAddCustomer = () => {
    setIsAddCustomerModalOpen(true);
  };

  const handleSaveCustomer = async () => {
    if (!customerName.trim()) return;
    
    setIsLoading(true);
    try {
      const customerId = await addCustomer({ name: customerName.trim() });
      const newCustomer = {
        id: customerId,
        name: customerName.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to Redux state
      dispatch(addCustomerToState(newCustomer));
      
      console.log('Customer added successfully');
      setCustomerName('');
      setIsAddCustomerModalOpen(false);
    } catch (error) {
      console.error('Error adding customer:', error);
      // TODO: Add proper error handling/notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCustomerName('');
    setIsAddCustomerModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-lg py-xl">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="text-3xl font-bold text-secondary-900 mb-sm">Customers</h1>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-medium overflow-hidden">
          {customersLoading ? (
            <div className="p-xl text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-md"></div>
              <p className="text-secondary-600">Loading customers...</p>
            </div>
          ) : error ? (
            <div className="p-xl text-center">
              <div className="bg-red-50 border border-red-200 rounded-md p-md">
                <p className="text-red-800">Error loading customers: {error}</p>
              </div>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-xl text-center">
              <div className="text-6xl mb-md">👥</div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-sm">
                No Customers Yet
              </h2>
              <p className="text-secondary-600 mb-lg">
                Add your first customer to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
                             <table className="w-full">
                 <thead className="bg-gray-50 border-b border-gray-200">
                   <tr>
                     <th className="px-lg py-md text-left text-sm font-medium text-secondary-700">
                       Sr. No.
                     </th>
                     <th className="px-lg py-md text-left text-sm font-medium text-secondary-700">
                       Customer Name
                     </th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200">
                   {customers.map((customer, index) => (
                     <tr key={customer.id} className="hover:bg-gray-50">
                       <td className="px-lg py-md text-sm text-secondary-600">
                         {index + 1}
                       </td>
                       <td className="px-lg py-md text-sm text-secondary-900 font-medium">
                         {customer.name}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          )}
        </div>

        {/* Add Customer Modal */}
        {isAddCustomerModalOpen && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-strong p-xl w-full max-w-md mx-4">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-lg">
                  Add Customer
                </h3>
                
                <div className="mb-lg">
                  <label className="block text-sm font-medium text-secondary-700 mb-sm">
                    Customer Name
                  </label>
                  <Input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    size='sm'
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveCustomer}
                    disabled={!customerName.trim() || isLoading}
                    size='sm'
                  >
                    {isLoading ? 'Adding...' : 'Add Customer'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <Button 
            variant="gradient" 
            size="md" 
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center !border-radius-50"
            style={{ borderRadius: '50%' }}
            onClick={handleAddCustomer}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Customers; 