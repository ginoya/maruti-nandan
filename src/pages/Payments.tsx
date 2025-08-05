import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui';
import AddPaymentModal from '../components/AddPaymentModal';
import type { AddPaymentData } from '../components/AddPaymentModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCustomers } from '../store/customersSlice';
import { fetchPayments, addPayment, softDeletePayment } from '../store/paymentsSlice';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Payments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: payments, loading, error } = useAppSelector((state) => state.payments);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<{ id: string; customerName: string; amount: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchPayments());
  }, [dispatch]);

  const handleAddPayment = () => {
    setIsAddPaymentModalOpen(true);
  };

  const handleCloseAddPaymentModal = () => {
    setIsAddPaymentModalOpen(false);
  };

  const handleSaveAddPaymentModal = async (data: AddPaymentData) => {
    try {
      await dispatch(addPayment({
        customerId: data.customerId,
        customerName: data.customerName,
        paymentDate: data.paymentDate,
        amount: data.amount,
        notes: data.notes
      })).unwrap();
      
      setIsAddPaymentModalOpen(false);
      
      // Fetch payments again to refresh the table
      dispatch(fetchPayments());
    } catch (error) {
      console.error('Failed to add payment:', error);
      // Keep modal open on error so user can retry
    }
  };

  const handleDeleteClick = (paymentId: string, customerName: string, amount: number) => {
    setPaymentToDelete({ id: paymentId, customerName, amount });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!paymentToDelete) return;
    
    setIsDeleting(true);
    try {
      // Delete the payment
      await dispatch(softDeletePayment(paymentToDelete.id)).unwrap();
      
      // Fetch fresh data from database
      await dispatch(fetchPayments()).unwrap();
      
      setDeleteModalOpen(false);
      setPaymentToDelete(null);
    } catch (error) {
      console.error('Error deleting payment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPaymentToDelete(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Navigation />
      
      {/* Main Content */}
      <div className="px-lg py-lg">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-lg">
            <h1 className="text-2xl font-bold text-secondary-900">Payments</h1>
          </div>

          {/* Loading State */}
          {(loading || isDeleting) && (
            <div className="flex justify-center items-center py-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-sm"></div>
                <div className="text-sm text-gray-600">
                  {isDeleting ? 'Deleting payment and refreshing data...' : 'Loading payments...'}
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-md mb-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Payments Table */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-md py-sm text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-md py-sm text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-md py-sm text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Date
                      </th>
                      <th className="px-md py-sm text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-md py-sm text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-md py-lg text-center text-gray-500">
                          No payments found. Add your first payment using the button below.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-md py-sm whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.customerName}
                            </div>
                          </td>
                          <td className="px-md py-sm whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </div>
                          </td>
                          <td className="px-md py-sm whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {payment.paymentDate}
                            </div>
                          </td>
                          <td className="px-md py-sm whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {payment.notes || '-'}
                            </div>
                          </td>
                          <td className="px-md py-sm whitespace-nowrap text-center">
                            <div className="flex gap-sm justify-center">
                              <button
                                onClick={() => payment.id && handleDeleteClick(payment.id, payment.customerName, payment.amount)}
                                className="p-sm text-error-600 hover:text-error-800 hover:bg-error-100 rounded-lg transition-colors"
                                title="Delete Payment"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Payment Button - Sticky at bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-end items-center px-xs py-lg" style={{ background: 'linear-gradient(to bottom, transparent, white)' }}>
        <Button 
          variant="gradient" 
          size="md" 
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center !border-radius-50 mr-3"
          style={{ borderRadius: '50%' }}
          onClick={handleAddPayment}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isAddPaymentModalOpen}
        onClose={handleCloseAddPaymentModal}
        onSave={handleSaveAddPaymentModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Payment"
        message={
          <span>
            Are you sure you want to delete the payment of{' '}
            <span className="font-bold text-error-600">{formatCurrency(paymentToDelete?.amount || 0)}</span>
            {' '}for{' '}
            <span className="font-bold text-secondary-800">{paymentToDelete?.customerName}</span>?
            {' '}This action cannot be undone.
          </span>
        }
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Payments; 