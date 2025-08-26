import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { Button, Tab, TabList, TabPanel } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchInvoices, softDeleteInvoice } from '../store/invoicesSlice';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';


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
  const [activeTab] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<{ id: string; invoiceNo: string; customer: string; amount: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleCreateInvoice = () => {
    navigate('/invoice/new');
  };

  const handleDeleteClick = (invoiceId: string, invoiceNo: string, customer: string, amount: number) => {
    setInvoiceToDelete({ id: invoiceId, invoiceNo, customer, amount });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;
    
    setIsDeleting(true);
    try {
      // Delete the invoice
      await dispatch(softDeleteInvoice(invoiceToDelete.id)).unwrap();
      
      // Fetch fresh data from database
      await dispatch(fetchInvoices()).unwrap();
      
      setDeleteModalOpen(false);
      setInvoiceToDelete(null);
    } catch (error) {
      console.error('Error deleting invoice:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setInvoiceToDelete(null);
  };

  // Group invoices by business name
  const groupedInvoices: GroupedInvoices = invoices.reduce((acc, invoice) => {
    const businessName = invoice.businessName || 'Unknown Business';
    const totalAmount = invoice.amount;
    
    if (!acc[businessName]) {
      acc[businessName] = [];
    }
    
    acc[businessName].push({
      customer: invoice.customer,
      amount: totalAmount || 0,
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate,
      id: invoice.id || ''
    });
    
    return acc;
  }, {} as GroupedInvoices);

  if (loading || isDeleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              {isDeleting ? 'Deleting invoice and refreshing data...' : 'Loading invoices...'}
            </div>
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

  console.log('invoices-->', invoices, groupedInvoices)

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
               {Object.keys(groupedInvoices).map(() => (
                //  <TabItem
                //    key={businessName}
                //    isActive={activeTab === index}
                //    onClick={() => setActiveTab(index)}
                //  >
                //    {businessName}
                //    </TabItem>
                <>  </>
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
                        <th className="text-left p-md font-medium text-gray-700 whitespace-nowrap">Date</th>
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
                            ₹{invoice.amount?.toLocaleString()}<>{console.log('invoice.amount-->', invoice)}</>
                          </td>
                          <td className="p-md text-gray-600 whitespace-nowrap">{invoice.invoiceDate}</td>
                          <td className="p-md text-center">
                            <div className="flex gap-sm justify-center">
                              <button
                                onClick={() => invoice.id && navigate(`/invoice/${invoice.id}`)}
                                className="p-sm text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors"
                                title="View Invoice"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => invoice.id && handleDeleteClick(invoice.id, invoice.invoiceNo, invoice.customer, invoice.amount)}
                                className="p-sm text-error-600 hover:text-error-800 hover:bg-error-100 rounded-lg transition-colors"
                                title="Delete Invoice"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message={
          <span>
            Are you sure you want to delete invoice{' '}
            <span className="font-bold text-error-600">{invoiceToDelete?.invoiceNo}</span>
            {' '}for{' '}
            <span className="font-bold text-secondary-800">{invoiceToDelete?.customer}</span>
            {' '}with amount{' '}
            <span className="font-bold text-error-600">₹{invoiceToDelete?.amount?.toLocaleString()}</span>?
            {' '}This action cannot be undone.
          </span>
        }
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Invoice; 