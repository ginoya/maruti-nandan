import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui';
import AddPaymentModal from '../components/AddPaymentModal';
import type { AddPaymentData } from '../components/AddPaymentModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCustomers } from '../store/customersSlice';
import { fetchPayments, addPayment } from '../store/paymentsSlice';

const Payments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: payments, loading, error } = useAppSelector((state) => state.payments);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);

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
        amount: data.amount
      })).unwrap();
      
      console.log('Payment added successfully:', data);
      setIsAddPaymentModalOpen(false);
      
      // Fetch payments again to refresh the table
      dispatch(fetchPayments());
    } catch (error) {
      console.error('Failed to add payment:', error);
      // Keep modal open on error so user can retry
    }
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
          {loading && (
            <div className="flex justify-center items-center py-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-md py-lg text-center text-gray-500">
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
    </div>
  );
};

export default Payments; 