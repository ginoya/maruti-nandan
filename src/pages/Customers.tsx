import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Button, Input } from '../components/ui';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { addCustomer } from '../services/customerService';
import { useCustomers } from '../hooks/useCustomers';
import { useAppDispatch } from '../store/hooks';
import { addCustomerToState, fetchCustomers, deleteCustomer } from '../store/customersSlice';

const Customers: React.FC = () => {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
      
      setCustomerName('');
      setIsAddCustomerModalOpen(false);
      
      // Fetch customers again to refresh the table
      dispatch(fetchCustomers());
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

  const handleDeleteClick = (customer: { id: string; name: string }) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteCustomer(customerToDelete.id)).unwrap();
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
      // TODO: Add proper error handling/notification
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
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
                    <th className="px-lg py-md text-right text-sm font-medium text-secondary-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer:any, index:any) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-lg py-md text-sm text-secondary-600">
                        {index + 1}
                      </td>
                      <td className="px-lg py-md text-sm text-secondary-900 font-medium">
                        {customer.name}
                      </td>
                      <td className="px-lg py-md text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(customer)}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </Button>
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
          <div className="fixed inset-0 bg-black bg-black/50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-lg shadow-strong px-xl pt-xl py-lg pb-lg w-full transform transition-transform duration-500 ease-out animate-slide-up">
              <div className="flex justify-between items-center mb-lg">
                <h2 className="text-xl font-bold text-secondary-900">Add Customer</h2>
                <button
                  onClick={handleCancel}
                  className="text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveCustomer(); }} className="space-y-lg">
                {/* Customer Name */}
                <div>
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

                {/* Action Buttons */}
                <div className="flex justify-between pt-xl" style={{paddingTop: '10px'}}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    size='sm'
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    size='sm'
                    className='px-xl'
                    disabled={!customerName.trim() || isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Customer'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Customer"
          message={
            <div>
              <p className="text-secondary-700 mb-sm">
                Are you sure you want to delete this customer?
              </p>
              <p className="text-sm text-secondary-600">
                <strong>Customer:</strong> {customerToDelete?.name}
              </p>
              {/* <p className="text-xs text-secondary-500 mt-sm">
                This action will soft delete the customer. The customer will be hidden from the list but can be restored if needed.
              </p> */}
            </div>
          }
          isLoading={isDeleting}
        />

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