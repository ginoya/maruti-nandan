import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Navigation from '../components/Navigation';
import { fetchInvoices } from '../store/invoicesSlice';
import { fetchPayments } from '../store/paymentsSlice';
import { useCustomers } from '../hooks/useCustomers';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { invoices, loading: invoicesLoading } = useAppSelector((state) => state.invoices);
  const { data: payments, loading: paymentsLoading } = useAppSelector((state) => state.payments);
  const { customers } = useCustomers();

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchPayments());
  }, [dispatch]);

  // Get list of active customer names (excluding soft-deleted customers)
  const activeCustomerNames = customers.map((customer: any) => customer.name);

  // Calculate overall invoice metrics (only for active customers)
  const invoiceMetrics = {
    totalTurnover: invoices.reduce((sum, invoice) => {
      // Only include invoices for active customers
      if (activeCustomerNames.includes(invoice.customer)) {
        return sum + (invoice.grandTotal || 0);
      }
      return sum;
    }, 0),
  };

  // Calculate overall payment metrics (only for active customers)
  const totalReceived = payments.reduce((sum, payment) => {
    // Only include payments for active customers
    if (activeCustomerNames.includes(payment.customerName)) {
      return sum + payment.amount;
    }
    return sum;
  }, 0);
  
  const paymentMetrics = {
    totalReceived,
    pendingAmount: invoiceMetrics.totalTurnover - totalReceived
  };

  // Calculate customer-wise metrics (only for active customers)
  const customerMetrics = invoices.reduce((acc, invoice) => {
    const customerName = invoice.customer;
    
    // Only include customers that are still active (not soft-deleted)
    if (!activeCustomerNames.includes(customerName)) {
      return acc;
    }
    
    if (!acc[customerName]) {
      acc[customerName] = {
        totalTurnover: 0,
        totalReceived: 0,
        pendingAmount: 0,
        invoiceCount: 0
      };
    }
    
    acc[customerName].totalTurnover += invoice.grandTotal || 0;
    acc[customerName].invoiceCount += 1;
    return acc;
  }, {} as Record<string, { totalTurnover: number; totalReceived: number; pendingAmount: number; invoiceCount: number }>);

  // Add payment data to customer metrics (only for active customers)
  payments.forEach(payment => {
    const customerName = payment.customerName;
    
    // Only include payments for active customers
    if (!activeCustomerNames.includes(customerName)) {
      return;
    }
    
    if (customerMetrics[customerName]) {
      customerMetrics[customerName].totalReceived += payment.amount;
    } else {
      // If customer doesn't exist in customerMetrics, create them
      customerMetrics[customerName] = {
        totalTurnover: 0,
        totalReceived: payment.amount,
        pendingAmount: 0,
        invoiceCount: 0
      };
    }
  });

  // Calculate pending amount for each customer
  Object.keys(customerMetrics).forEach(customerName => {
    customerMetrics[customerName].pendingAmount = 
      customerMetrics[customerName].totalTurnover - customerMetrics[customerName].totalReceived;
  });



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCustomerClick = (customerName: string) => {
    navigate(`/customer/${encodeURIComponent(customerName)}`);
  };

  const isLoading = invoicesLoading || paymentsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-md">
        {isLoading ? (
          <div className="flex justify-center items-center py-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {/* Overall Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-lg">
                <div className="flex items-center justify-between mb-md">
                  <h3 className="text-base font-semibold text-secondary-900">Total Turnover</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">₹</span>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-600 mb-xs">
                  {formatCurrency(invoiceMetrics.totalTurnover)}
                </div>
                <p className="text-xs text-secondary-600">Total invoice value</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-lg">
                <div className="flex items-center justify-between mb-md">
                  <h3 className="text-base font-semibold text-secondary-900">Total Received</h3>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">💰</span>
                  </div>
                </div>
                <div className="text-xl font-bold text-green-600 mb-xs">
                  {formatCurrency(paymentMetrics.totalReceived)}
                </div>
                <p className="text-xs text-secondary-600">Payments collected</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-lg">
                <div className="flex items-center justify-between mb-md">
                  <h3 className="text-base font-semibold text-secondary-900">Pending Amount</h3>
                  <div className="w-8 h-8 bg-error-100 rounded-full flex items-center justify-center">
                    <span className="text-error-600 text-sm">⚠</span>
                  </div>
                </div>
                <div className={`text-xl font-bold mb-xs ${paymentMetrics.pendingAmount < 0 ? 'text-green-600' : 'text-error-600'}`}>
                  {formatCurrency(paymentMetrics.pendingAmount)}
                </div>
                <p className="text-xs text-secondary-600">Outstanding amount</p>
              </div>
            </div>

            {/* Customer-wise Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-lg">Customer-wise Summary</h3>
              <div className="space-y-sm">
                {Object.entries(customerMetrics)
                  .sort(([, a], [, b]) => b.totalTurnover - a.totalTurnover) // Sort by turnover descending
                  .map(([customerName, metrics]) => (
                    <div 
                      key={customerName} 
                      className="bg-white rounded-lg shadow-sm border border-gray-100 p-lg cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleCustomerClick(customerName)}
                    >
                      <div className="flex items-center justify-between mb-md">
                        <div className="flex items-center gap-sm">
                          <h4 className="font-semibold text-secondary-900 text-lg">{customerName}</h4>
                          <span className="text-primary-500 text-sm">→</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-secondary-600 mb-xs">Turnover</div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(metrics.totalTurnover)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-lg">
                        <div className="text-center p-sm bg-gray-50 rounded-lg">
                          <div className="text-xs text-secondary-600 font-medium mb-xs">Received</div>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(metrics.totalReceived)}
                          </div>
                        </div>
                        <div className="text-center p-sm bg-gray-50 rounded-lg">
                          <div className="text-xs text-secondary-600 font-medium mb-xs">Pending</div>
                          <div className={`text-lg font-bold ${metrics.pendingAmount < 0 ? 'text-green-600' : 'text-error-600'}`}>
                            {formatCurrency(metrics.pendingAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home; 
