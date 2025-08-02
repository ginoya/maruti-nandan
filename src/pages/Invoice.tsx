import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { Button, Tab, TabList, TabItem, TabPanel } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchInvoices } from '../store/invoicesSlice';

interface GroupedInvoices {
  [businessName: string]: {
    customer: string;
    amount: number;
    invoiceNo: string;
    invoiceDate: string;
    id: string;
  }[];
}

const Invoice: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { invoices, loading, error } = useAppSelector((state) => state.invoices);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleCreateInvoice = () => {
    navigate('/invoice/new');
  };

  // Group invoices by business name
  const groupedInvoices: GroupedInvoices = invoices.reduce((acc, invoice) => {
    const businessName = invoice.businessName || 'Unknown Business';
    const totalAmount = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    
    if (!acc[businessName]) {
      acc[businessName] = [];
    }
    
    acc[businessName].push({
      customer: invoice.customer,
      amount: totalAmount,
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate,
      id: invoice.id || ''
    });
    
    return acc;
  }, {} as GroupedInvoices);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading invoices...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-md">
        <div className="flex justify-between items-center mb-lg">
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <Button variant="gradient" size="sm" className="px-lg py-sm" onClick={handleCreateInvoice}>
            + New Invoice
          </Button>
        </div>

                 {Object.keys(groupedInvoices).length === 0 ? (
           <div className="text-center py-xl">
             <div className="text-lg text-gray-600 mb-md">No invoices found</div>
             <Button variant="gradient" size="sm" onClick={handleCreateInvoice}>
               Create your first invoice
             </Button>
           </div>
         ) : (
           <Tab className="bg-white rounded-lg shadow-md">
                           <TabList className="">
               {Object.keys(groupedInvoices).map((businessName, index) => (
                 <TabItem
                   key={businessName}
                   isActive={activeTab === index}
                   onClick={() => setActiveTab(index)}
                 >
                   {businessName}
                 </TabItem>
               ))}
             </TabList>
             
                           {Object.entries(groupedInvoices).map(([businessName, invoices], index) => (
                <TabPanel key={businessName} isActive={activeTab === index} className="">
                 <div className="overflow-x-auto">
                   <table className="w-full border-collapse">
                                           <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left p-md font-medium text-gray-700">Invoice No</th>
                        <th className="text-left p-md font-medium text-gray-700">Customer Name</th>
                        <th className="text-right p-md font-medium text-gray-700">Amount</th>
                        <th className="text-left p-md font-medium text-gray-700">Date</th>
                        <th className="text-center p-md font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                   <tbody>
                                           {invoices.map((invoice) => (
                        <tr 
                          key={invoice.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-md text-gray-600">{invoice.invoiceNo}</td>
                          <td className="p-md text-gray-800">{invoice.customer}</td>
                          <td className="p-md text-right font-medium text-gray-800">
                            ₹{invoice.amount.toLocaleString()}
                          </td>
                          <td className="p-md text-gray-600">{invoice.invoiceDate}</td>
                          <td className="p-md text-center">
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
                                       <tfoot>
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td colSpan={2} className="p-md font-semibold text-gray-700">
                          Total Amount
                        </td>
                        <td className="p-md text-right font-bold text-gray-800">
                          ₹{invoices.reduce((sum, invoice) => sum + invoice.amount, 0).toLocaleString()}
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tfoot>
                 </table>
               </div>
             </TabPanel>
           ))}
         </Tab>
       )}
      </div>
    </div>
  );
};

export default Invoice; 