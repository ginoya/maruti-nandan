import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Button, Tab, TabList, TabItem, TabPanel, Dropdown } from '../components/ui';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchInvoices } from '../store/invoicesSlice';
import { fetchPayments } from '../store/paymentsSlice';
import { parseDate } from '../utils/dateUtils';

const CustomerDetails: React.FC = () => {
  const { customerName } = useParams<{ customerName: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { invoices, loading: invoicesLoading } = useAppSelector((state) => state.invoices);
  const { data: payments, loading: paymentsLoading } = useAppSelector((state) => state.payments);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchPayments());
  }, [dispatch]);

  // Generate month and year options
  const monthOptions = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const yearOptions = [
    { value: 'all', label: 'All Years' },
    ...Array.from({ length: 10 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year.toString(), label: year.toString() };
    })
  ];

  // Filter invoices and payments based on selected month and year
  const customerInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => 
      invoice.customer === customerName
    );

    if (selectedMonth !== 'all' || selectedYear !== 'all') {
      filtered = filtered.filter(invoice => {
        const parsedDate = parseDate(invoice.invoiceDate);
        if (!parsedDate) return false;
        
        const monthMatch = selectedMonth === 'all' || parsedDate.month.toString() === selectedMonth;
        const yearMatch = selectedYear === 'all' || parsedDate.year.toString() === selectedYear;
        
        return monthMatch && yearMatch;
      });
    }

    return filtered;
  }, [invoices, customerName, selectedMonth, selectedYear]);

  const customerPayments = useMemo(() => {
    let filtered = payments.filter(payment => 
      payment.customerName === customerName
    );

    if (selectedMonth !== 'all' || selectedYear !== 'all') {
      filtered = filtered.filter(payment => {
        const parsedDate = parseDate(payment.paymentDate);
        if (!parsedDate) return false;
        
        const monthMatch = selectedMonth === 'all' || parsedDate.month.toString() === selectedMonth;
        const yearMatch = selectedYear === 'all' || parsedDate.year.toString() === selectedYear;
        
        return monthMatch && yearMatch;
      });
    }

    return filtered;
  }, [payments, customerName, selectedMonth, selectedYear]);

  // Calculate customer metrics
  const customerMetrics = {
    totalTurnover: customerInvoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0),
    totalReceived: customerPayments.reduce((sum, payment) => sum + payment.amount, 0),
    invoiceCount: customerInvoices.length,
    paymentCount: customerPayments.length,
    pendingAmount: 0
  };

  customerMetrics.pendingAmount = customerMetrics.totalTurnover - customerMetrics.totalReceived;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const isLoading = invoicesLoading || paymentsLoading;

  if (!customerName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-md">Customer not found</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-md">
        {/* Header */}
        <div className="mb-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="mb-md"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-lg">
            {customerName}
          </h1>
          
          {/* Filter Controls */}
          <div className="flex gap-md mb-lg">
            <div className="flex-1">
              <Dropdown
                options={monthOptions}
                value={selectedMonth}
                onValueChange={setSelectedMonth}
                placeholder="Select Month"
                label="Filter by Month"
              />
            </div>
            <div className="flex-1">
              <Dropdown
                options={yearOptions}
                value={selectedYear}
                onValueChange={setSelectedYear}
                placeholder="Select Year"
                label="Filter by Year"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <Tab className="bg-white rounded-lg shadow-md">
            <TabList>
              <TabItem
                isActive={activeTab === 0}
                onClick={() => setActiveTab(0)}
              >
                Invoices ({customerInvoices.length})
              </TabItem>
              <TabItem
                isActive={activeTab === 1}
                onClick={() => setActiveTab(1)}
              >
                Payments ({customerPayments.length})
              </TabItem>
            </TabList>
            
            {/* Invoices Tab */}
            <TabPanel isActive={activeTab === 0} className="p-lg">
              {customerInvoices.length === 0 ? (
                <div className="text-center py-xl">
                  <div className="text-lg text-gray-600 mb-md">No invoices found for this customer</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left p-sm font-medium text-gray-700">Date</th>
                        <th className="text-right p-sm font-medium text-gray-700">Amount</th>
                        <th className="text-center p-sm font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerInvoices.map((invoice) => (
                        <tr 
                          key={invoice.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-sm text-gray-600">{invoice.invoiceDate}</td>
                          <td className="p-sm text-right font-medium text-gray-800">
                            {formatCurrency(invoice.grandTotal || 0)}
                          </td>
                          <td className="p-sm text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => invoice.id && navigate(`/invoice/${invoice.id}`)}
                              className="px-sm py-xs text-xs"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabPanel>
            
            {/* Payments Tab */}
            <TabPanel isActive={activeTab === 1} className="p-lg">
              {customerPayments.length === 0 ? (
                <div className="text-center py-xl">
                  <div className="text-lg text-gray-600 mb-md">No payments found for this customer</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left p-sm font-medium text-gray-700">Payment Date</th>
                        <th className="text-right p-sm font-medium text-gray-700">Amount</th>
                        <th className="text-left p-sm font-medium text-gray-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerPayments.map((payment) => (
                        <tr 
                          key={payment.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-sm text-gray-600">{payment.paymentDate}</td>
                          <td className="p-sm text-right font-medium text-green-600">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="p-sm text-gray-600">{payment.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabPanel>
          </Tab>
        )}
      </div>
      
      {/* Fixed Footer with Totals */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-md py-sm">
          <div className="flex justify-between items-center">
            <div className="flex gap-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-lg font-bold text-gray-800">
                  {formatCurrency(customerMetrics.totalTurnover)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Total Received</div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(customerMetrics.totalReceived)}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Pending Amount</div>
              <div className={`text-lg font-bold ${customerMetrics.pendingAmount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(customerMetrics.pendingAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom padding to account for fixed footer */}
      <div className="h-20"></div>
    </div>
  );
};

export default CustomerDetails; 