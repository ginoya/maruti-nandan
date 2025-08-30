import React, { useEffect, useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchInvoices } from '../store/invoicesSlice';
import { fetchPayments } from '../store/paymentsSlice';
import { fetchCustomers } from '../store/customersSlice';
import { Button } from '../components/ui';
import { generateReportPDF } from '../utils/pdfGenerator';

interface MonthwiseCustomerData {
  srNo: number;
  customerName: string;
  totalWeight: number;
  totalAmount: number;
  totalPaymentPending: number;
  totalPaymentReceived: number;
}

const MonthwiseReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { invoices, loading: invoicesLoading } = useAppSelector((state) => state.invoices);
  const { data: payments, loading: paymentsLoading } = useAppSelector((state) => state.payments);
  const { data: customers, loading: customersLoading } = useAppSelector((state) => state.customers);
  
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [monthwiseData, setMonthwiseData] = useState<MonthwiseCustomerData[]>([]);
  const [customer, setCustomer] = useState('')
  // Helper to parse DD-MM-YYYY into Date
  const parseDDMMYYYY = (value: string): Date | null => {
    if (!value || typeof value !== 'string') return null;
    const parts = value.split('-');
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts;
    const day = Number(dd);
    const month = Number(mm);
    const year = Number(yyyy);
    if (!day || !month || !year) return null;
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  };

  // Get current month and year for default selection
  const currentMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }, []);

  useEffect(() => {
    // Set default selected month to current month
    if (!selectedMonth) {
      setSelectedMonth(currentMonth);
    }
  }, [currentMonth, selectedMonth]);

  useEffect(() => {
    // Fetch data when component mounts
    dispatch(fetchInvoices());
    dispatch(fetchPayments());
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Calculate monthwise data when selectedMonth, invoices, payments, or customers change
  useEffect(() => {
    if (!selectedMonth || !invoices.length || !customers.length) return;

    const data: MonthwiseCustomerData[] = customers.map((customer: any, index: number) => {
      // Filter invoices for this customer and selected month
      const customerInvoices = invoices.filter(invoice => {
        if (invoice.customer !== customer.name) return false;
        
        // Parse invoice date (assuming format DD-MM-YYYY)
        const [, month, year] = invoice.invoiceDate.split('-');
        const invoiceMonthYear = `${year}-${month}`;
        
        return invoiceMonthYear === selectedMonth;
      });

      // Calculate total weight and amount for the selected month
      const totalWeight = customerInvoices.reduce((sum, invoice) => {
        return sum + invoice.items.reduce((itemSum, item) => {
          return itemSum + (item.geru || 0) + (item.white || 0) + (item.jaipuri || 0) + (item.damar || 0) + (item.gold || 0);
        }, 0);
      }, 0);

      const totalAmount = customerInvoices.reduce((sum, invoice) => {
        return sum + (invoice.amount || 0);
      }, 0);

      // Calculate total payment pending up to the end of the selected month (exclude future months)
      const [selYearStr, selMonthStr] = selectedMonth.split('-');
      const selYear = Number(selYearStr);
      const selMonth = Number(selMonthStr); // 1-12
      // Last day of selected month
      const cutoffDate = new Date(selYear, selMonth, 0);

      // Invoices up to cutoff
      const customerInvoicesUptoCutoff = invoices.filter(inv => {
        if (inv.customer !== customer.name) return false;
        // invoice.invoiceDate is DD-MM-YYYY
        const invDate = parseDDMMYYYY(inv.invoiceDate);
        return invDate ? invDate.getTime() <= cutoffDate.getTime() : false;
      });
      const totalInvoicedUptoCutoff = customerInvoicesUptoCutoff.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);

      // Payments up to cutoff
      const paymentsUptoCutoff = payments.filter(payment => {
        if (payment.customerName !== customer.name) return false;
        const payDate = parseDDMMYYYY(payment.paymentDate as string) || new Date(payment.paymentDate as any);
        return !isNaN(payDate.getTime()) && payDate.getTime() <= cutoffDate.getTime();
      });
      const totalPaymentsUptoCutoff = paymentsUptoCutoff.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      const totalPaymentPending = totalInvoicedUptoCutoff - totalPaymentsUptoCutoff;

      // Calculate total payment received for the selected month
      const monthPayments = payments.filter(payment => {
        if (payment.customerName !== customer.name) return false;

        // Parse payment date stored as DD-MM-YYYY
        // Fall back gracefully if format differs
        let paymentMonthYear = '';
        if (typeof payment.paymentDate === 'string' && payment.paymentDate.includes('-')) {
          const parts = payment.paymentDate.split('-');
          // Expecting [dd, mm, yyyy]
          if (parts.length === 3) {
            const [, mm, yyyy] = parts;
            if (yyyy && mm) {
              paymentMonthYear = `${yyyy}-${String(Number(mm)).padStart(2, '0')}`;
            }
          }
        }
        if (!paymentMonthYear) {
          const d = new Date(payment.paymentDate as any);
          if (!isNaN(d.getTime())) {
            paymentMonthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          }
        }

        return paymentMonthYear === selectedMonth;
      });

      const totalPaymentReceived = monthPayments.reduce((sum, payment) => {
        return sum + (payment.amount || 0);
      }, 0);

      return {
        srNo: index + 1,
        customerName: customer.name,
        totalWeight,
        totalAmount,
        // Pending is lifetime up to cutoff; do not subtract month received again
        totalPaymentPending,
        totalPaymentReceived
      };
    });

    // Show only customers who have invoices or payments in selected month,
    // or have a non-zero pending amount (lifetime up to cutoff)
    const filtered = data.filter((row) => {
      const hasMonthActivity = (row.totalWeight > 0) || (row.totalAmount > 0) || (row.totalPaymentReceived > 0);
      const hasPending = Math.round(row.totalPaymentPending) !== 0;
      return hasMonthActivity || hasPending;
    });

    // Reassign serial numbers after filtering
    const reindexed = filtered.map((row, idx) => ({ ...row, srNo: idx + 1 }));

    setMonthwiseData(reindexed);
  }, [selectedMonth, invoices, payments, customers]);

  // Generate month options from June 2025 to current month (most recent first)
  const monthOptions = useMemo(() => {
    const options = [] as { value: string; label: string }[];
    const now = new Date();
    const start = new Date(2025, 5, 1); // June is month index 5

    // Start from current month and go backwards to June 2025
    for (
      let date = new Date(now.getFullYear(), now.getMonth(), 1);
      date.getTime() >= start.getTime();
      date = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    ) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthYear = `${year}-${month}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value: monthYear, label: monthName });
    }

    return options;
  }, []);

  const loading = invoicesLoading || paymentsLoading || customersLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading monthwise report...</div>
          </div>
        </div>
      </div>
    );
  }

  // Pre-calculate totals for summary cards
  const totalWeight = monthwiseData.reduce((sum, row) => sum + row.totalWeight, 0);
  const totalAmount = monthwiseData.reduce((sum, row) => sum + row.totalAmount, 0);
  const totalPending = monthwiseData.reduce((sum, row) => sum + row.totalPaymentPending, 0);
  const averageAmountPerKg = totalWeight > 0 ? totalAmount / totalWeight : 0;


  const getCutomerOptions = [...monthwiseData.map((row)=>{
    return {
      label:row.customerName,
      value:row.customerName
    }
  }),{label:'All', value:''}];

  const filteredMonthWiseData = customer === '' ? monthwiseData : monthwiseData.filter((row)=>row.customerName === customer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-xl">
          <h1 className="text-3xl font-bold text-gray-800">Report</h1>
          <div className="flex items-center space-x-md">
            {/* <label htmlFor="month-select" className="text-sm font-medium text-gray-700">
              Select Month:
            </label> */}
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-md py-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
        <div className="flex items-center space-x-md">
            {/* <label htmlFor="month-select" className="text-sm font-medium text-gray-700">
              Select Month:
            </label> */}
            <select
              id="customer-select"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="px-md py-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {getCutomerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Printable Content Wrapper */}
        <div className="report-print">
        {/* Report Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-md font-medium text-gray-700">Sr. No</th>
                  <th className="text-left p-md font-medium text-gray-700">Customer Name</th>
                  <th className="text-right p-md font-medium text-gray-700">Total Weight (kg)</th>
                  <th className="text-right p-md font-medium text-gray-700">Total Amount (₹)</th>
                  <th className="text-right p-md font-medium text-gray-700">Payment Pending (₹)</th>
                  <th className="text-right p-md font-medium text-gray-700">Payment Received (₹)</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonthWiseData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-xl text-gray-500">
                      No data available for the selected month
                    </td>
                  </tr>
                ) : (
                  filteredMonthWiseData.map((row, index) => (
                    <tr 
                      key={row.customerName} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-md text-gray-600 font-medium">{index + 1}</td>
                      <td className="p-md text-gray-800 font-medium">{row.customerName}</td>
                      <td className="p-md text-right text-gray-600">
                        {Math.round(row.totalWeight).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-md text-right font-medium text-gray-800">
                        ₹{Math.round(row.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-md text-right font-medium text-error-600">
                        ₹{Math.round(row.totalPaymentPending).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-md text-right font-medium text-success-600">
                        ₹{Math.round(row.totalPaymentReceived).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className={`bg-gray-50 border-t border-gray-200 ${customer === '' ? '' : 'print-hide'}`}>
                  <td colSpan={2} className="p-md font-semibold text-gray-700">
                    Totals
                  </td>
                  <td className="p-md text-right font-bold text-gray-800">
                    {Math.round(totalWeight).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className="p-md text-right font-bold text-gray-800">
                    ₹{Math.round(monthwiseData.reduce((sum, row) => sum + row.totalAmount, 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className="p-md text-right font-bold text-error-600">
                    ₹{Math.round(monthwiseData.reduce((sum, row) => sum + row.totalPaymentPending, 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className="p-md text-right font-bold text-success-600">
                    ₹{Math.round(monthwiseData.reduce((sum, row) => sum + row.totalPaymentReceived, 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mt-xl pdf-flex pdf-summary">
          <div className="bg-white rounded-lg shadow-md p-lg pdf-flex print-hide">
            <h3 className="text-sm font-medium text-gray-500 mb-sm pr-4-br mtn-4">Total Weight</h3>
            <p className="text-2xl font-bold text-gray-900 pl-4 mtn-4">
              {Math.round(totalWeight).toLocaleString('en-IN', { maximumFractionDigits: 0 })}kg
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-lg print-hide">
            <h3 className="text-sm font-medium text-gray-500 mb-sm">Total Amount</h3>
            <p className="text-2xl font-bold text-gray-900">
              ₹{Math.round(totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-lg print-hide">
            <h3 className="text-sm font-medium text-gray-500 mb-sm">Total Pending</h3>
            <p className="text-2xl font-bold text-error-600">
              ₹{Math.round(totalPending).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className={`bg-white rounded-lg shadow-md p-lg pdf-flex  ${customer === '' ? '' : 'print-hide'}`}>
            <h3 className="text-sm font-medium text-gray-500 mb-sm pr-4-br mtn-4">Average (₹/kg)</h3>
            <p className="text-2xl font-bold text-gray-900 pl-4 mtn-4">
              ₹{Math.round(averageAmountPerKg).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        </div>
      </div>
      {/* Fixed bottom print button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="sm"
          variant="gradient"
          className="px-lg shadow-lg rounded-full"
          onClick={async () => {
            const label = monthOptions.find((m) => m.value === selectedMonth)?.label || selectedMonth;
            // Build date range text: From 1st of selected month to last day
            const [y, m] = selectedMonth.split('-').map(Number);
            const fromDate = new Date(y, m - 1, 1).toLocaleDateString('en-IN');
            const toDate = new Date(y, m, 0).toLocaleDateString('en-IN');
            const dateRange = `From: ${fromDate}  To: ${toDate}`;
            await generateReportPDF('.report-print', `report-${label}.pdf`, { dateRange });
          }}
        >
          Print
        </Button>
      </div>
    </div>
  );
};

export default MonthwiseReport; 