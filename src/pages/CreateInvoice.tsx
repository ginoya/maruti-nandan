import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from '../components/ui';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import EditInvoiceModal from '../components/EditInvoiceModal';
import type { EditInvoiceData } from '../components/EditInvoiceModal';
import AddInvoiceItemModal from '../components/AddInvoiceItemModal';
import type { AddInvoiceItemData } from '../components/AddInvoiceItemModal';
import EditInvoiceItemModal from '../components/EditInvoiceItemModal';
import RatesModal from '../components/RatesModal';
import { useInvoice } from '../hooks/useInvoice';
import { useInvoices } from '../hooks/useInvoices';
import { invoiceService } from '../services/invoiceService';

const CreateInvoice: React.FC = () => {
  const { invoiceData, calculateTotals, updateDetails, addItem, removeItem, updateItem, reset, updateRates } = useInvoice();
  const { saveInvoiceToFirebase, refetch } = useInvoices();
  const navigate = useNavigate();

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<AddInvoiceItemData | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  const handleEditInvoice = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleAddItem = () => {
    setIsAddItemModalOpen(true);
  };

  const handleEditRates = () => {
    setIsRatesModalOpen(true);
  };

  const handleCloseAddItemModal = () => {
    setIsAddItemModalOpen(false);
  };

  const handleCloseRatesModal = () => {
    setIsRatesModalOpen(false);
  };

  const handleSaveAddItemModal = (data: AddInvoiceItemData) => {
    const [year, month, day] = data.date.split('-');
    const displayDate = `${day}-${month}-${year}`;
    addItem({
      date: displayDate,
      geru: data.geru,
      white: data.white,
      jaipuri: data.jaipuri,
      damar: data.damar,
      gold: data.gold,
    } as any);
  };

  const handleSaveRatesModal = (data: { geruRate: number; whiteRate: number; jaipuriRate: number; damarRate: number; goldRate: number }) => {
    updateRates(data);
  };

  const handleDeleteItem = (id: number) => {
    removeItem(id);
  };

  const handleEditItem = (item: any) => {
    const [day, month, year] = (item.date || '').split('-');
    setSelectedItemForEdit({
      date: `${year}-${month?.padStart(2,'0')}-${day?.padStart(2,'0')}`,
      geru: item.geru,
      white: item.white,
      jaipuri: item.jaipuri,
      damar: item.damar,
      gold: item.gold,
      total: item.total,
    } as any);
    setIsEditItemModalOpen(true);
  };

  const handleCloseEditItemModal = () => {
    setIsEditItemModalOpen(false);
    setSelectedItemForEdit(null);
  };

  const handleSaveEditItemModal = (data: AddInvoiceItemData) => {
    if (selectedItemForEdit) {
      const itemToUpdate = invoiceData.items.find(item => (
        item.geru === selectedItemForEdit.geru &&
        item.white === selectedItemForEdit.white &&
        item.jaipuri === selectedItemForEdit.jaipuri &&
        item.damar === selectedItemForEdit.damar &&
        item.gold === selectedItemForEdit.gold
      ));
      if (itemToUpdate) {
        const [year, month, day] = data.date.split('-');
        const displayDate = `${day}-${month}-${year}`;
        updateItem(itemToUpdate.id, {
          date: displayDate,
          geru: data.geru,
          white: data.white,
          jaipuri: data.jaipuri,
          damar: data.damar,
          gold: data.gold,
        });
      }
    }
  };

  useEffect(() => {
    if(!invoiceData.businessName){
      handleEditInvoice();
    }
  }, []);

  const handleSaveEditModal = (data: EditInvoiceData) => {
    // Update invoice details in Redux
    updateDetails({
      businessName: data.business,
      customer: data.customer,
      invoiceDate: (() => {
        // Convert YYYY-MM-DD to DD-MM-YYYY format
        const [year, month, day] = data.date.split('-');
        return `${day}-${month}-${year}`;
      })(),
      // Set manual invoice number if provided, otherwise keep empty for auto-generation
      invoiceNo: data.invoiceNo || ''
    });
    setIsEditModalOpen(false);
  };

  const totals = calculateTotals();

  const handleGenerateInvoice = async () => {
    if (isGeneratingInvoice) return; // Prevent multiple clicks
    
    setIsGeneratingInvoice(true);
    try {
      let finalInvoiceNumber: string;
      
      // Use manual invoice number if provided, otherwise generate one
      let shouldIncrementCounter = false;
      if (invoiceData.invoiceNo && invoiceData.invoiceNo.trim() !== '') {
        finalInvoiceNumber = invoiceData.invoiceNo.trim();
        // Don't increment counter for manual invoice numbers
        shouldIncrementCounter = false;
      } else {
        // Generate next invoice number for this customer
        finalInvoiceNumber = await invoiceService.generateNextInvoiceNumber(invoiceData.customer);
        // Update the invoice number in Redux
        updateDetails({ invoiceNo: finalInvoiceNumber });
        // Increment counter for auto-generated invoice numbers
        shouldIncrementCounter = true;
      }
      
      // Create a copy of invoiceData with the final invoice number
      const invoiceDataWithNumber = {
        ...invoiceData,
        invoiceNo: finalInvoiceNumber,
        grandTotal: totals.grandTotal
      };
      console.log('invoiceDataWithNumber', invoiceDataWithNumber)
      // Save the invoice to Firebase with the invoice number
      const success = await saveInvoiceToFirebase(invoiceDataWithNumber, shouldIncrementCounter);
      if (success) {
        // Fetch invoices again to refresh the data
        refetch();
        
        // Then generate the PDF using the same invoice number
        await generateInvoicePDF(`invoice-${finalInvoiceNumber}-${invoiceData.invoiceDate}.pdf`);
        
        // You can add a success toast notification here
        
        // Reset the invoice slice after successful save and print
        reset();
        
        // Redirect to invoices page after successful save and print
        navigate('/invoice');
      } else {
        console.error('Failed to save invoice to Firebase');
      }
    } catch (error) {
      console.error('Failed to save invoice or generate PDF:', error);
      // You can add an error toast notification here
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div style={{paddingBottom: '50px'}}>
      <div className=" py-xl print-this pb-20">
        {/* Invoice Form */}
        <div>
          {/* Invoice Header */}
          <div className="text-center mb-xl">
            <div className="text-lg text-red-900 mb-sm">શ્રી ગણેશાય નમઃ</div>
            <h2 className="text-2xl font-bold mb-lg text-gray-800" >{invoiceData.businessName}</h2>
          </div>

          {/* Client and Invoice Information Table */}
          <div className="mb-lg">
            <table className="w-full border-collapse border border-blue-300 invoice-detail-table">
              <tbody>
                <tr>
                  <td style={{ width : "36%"}} className="border border-blue-300 px-md py-sm text-sm text-gray-700 font-medium w-56 left-top-align" colSpan={2} rowSpan={2}>{`M/S. : ${invoiceData.customer}`}</td>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 font-medium w-22"><span className='number-span-bold'>Invoice No.:</span></td>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 w-22"><span className='number-span-bold'>{invoiceData.invoiceNo}</span></td>
                </tr>
                <tr>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 font-medium"><span className='number-span-bold'>Invoice Date:</span></td>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700" colSpan={1}><span className='number-span-bold'>{invoiceData.invoiceDate}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-blue-300 invoice-table">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">No.</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Date</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Geru</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">White</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Jaipuri</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Damar</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Gold</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700 br-none">Total</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700 print-hide">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.no}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 whitespace-nowrap"><span className='number-span'>{item.date}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.geru}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.white}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.jaipuri}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.damar}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.gold}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 br-none"><span className='number-span'>{item.total}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 print-hide">
                      <div className="flex gap-sm">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Edit item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                          title="Delete item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="bg-gray-50">
                  {/* <td className="border border-blue-300 px-md text-sm text-gray-700"></td> */}
                  <td colSpan={2} className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>Total Weight</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.geru}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.white}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.jaipuri}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.damar}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.gold}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700 br-none"><span className='number-span'>{totals.geru + totals.white + totals.jaipuri + totals.damar + totals.gold}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700 print-hide"></td>
                </tr>

                <tr className="bg-gray-50">
                  {/* <td className="border border-blue-300 px-md text-sm text-gray-700"></td> */}
                  <td colSpan={2} className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>Rate</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.geruRate}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.whiteRate}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.jaipuriRate}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.damarRate}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.goldRate}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700 br-none"></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700 print-hide"></td>
                </tr>

                <tr className="bg-gray-50">
                  {/* <td className="border border-blue-300 px-md text-sm text-gray-700"></td> */}
                  <td colSpan={2} className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>Total</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.geruRate * totals.geru}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.whiteRate * totals.white}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.jaipuriRate * totals.jaipuri}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.damarRate * totals.damar}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"><span className='number-span'>{totals.goldRate * totals.gold}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700 br-none"><span className='number-span'>{totals.grandTotal}</span></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700 print-hide"></td>
                </tr>

                <tr className="bg-gray-50 font-bold bt-1">
                  <td className="border border-blue-300 px-md py-sm text-lg text-gray-700" colSpan={4}>Grand Total</td>
                  <td className="border border-blue-300 px-md py-sm text-lg text-gray-700 br-none" colSpan={3}>{totals.grandTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
      {/* Generate Invoice Button - Sticky at bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-xs py-lg" style={{ background: 'linear-gradient(to bottom, transparent, white)' }}>
        <div className="flex gap-sm">
          <Button 
            variant="gradient" 
            size="md" 
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center !border-radius-50"
            style={{ borderRadius: '50%' }}
            onClick={handleAddItem}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
          <Button 
            variant="gradient" 
            size="md" 
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center !border-radius-50"
            style={{ borderRadius: '50%' }}
            onClick={handleEditInvoice}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button 
            variant="gradient" 
            size="md" 
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center !border-radius-50"
            style={{ borderRadius: '50%' }}
            onClick={handleEditRates}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm8-1h-2.09a6.978 6.978 0 00-1.272-2.046l1.48-1.48-1.414-1.414-1.48 1.48A6.978 6.978 0 0013 2.09V0h-2v2.09a6.978 6.978 0 00-2.046 1.272l-1.48-1.48L6.06 3.296l1.48 1.48A6.978 6.978 0 006.268 6.09H4.178v2h2.09c.192.733.512 1.418.946 2.038l-1.48 1.48 1.414 1.414 1.48-1.48c.62.434 1.305.754 2.038.946v2.09h2v-2.09c.733-.192 1.418-.512 2.038-.946l1.48 1.48 1.414-1.414-1.48-1.48c.434-.62.754-1.305.946-2.038h2.09v-2z" />
            </svg>
          </Button>
        </div>
        <Button 
          variant="gradient" 
          size="md" 
          onClick={handleGenerateInvoice}
          disabled={isGeneratingInvoice}
        >
          {isGeneratingInvoice ? 'Saving & Printing...' : 'Print'}
        </Button>
      </div>

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditModal}
        initialData={{
          business: invoiceData.businessName,
          customer: invoiceData.customer,
          date: (() => {
            // Convert DD-MM-YYYY to YYYY-MM-DD format
            const [day, month, year] = invoiceData.invoiceDate.split('-');
            return `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`;
          })(),
          invoiceNo: invoiceData.invoiceNo
        }}
      />

      {/* Add Invoice Item Modal */}
      <AddInvoiceItemModal
        isOpen={isAddItemModalOpen}
        onClose={handleCloseAddItemModal}
        onSave={handleSaveAddItemModal}
      />

      {/* Edit Invoice Item Modal */}
      <EditInvoiceItemModal
        isOpen={isEditItemModalOpen}
        onClose={handleCloseEditItemModal}
        onSave={handleSaveEditItemModal}
        initialData={selectedItemForEdit || {
          date: new Date().toISOString().split('T')[0],
          geru: 0,
          white: 0,
          jaipuri: 0,
          damar: 0,
          gold: 0,
          total: 0
        }}
      />

      {/* Rates Modal */}
      <RatesModal
        isOpen={isRatesModalOpen}
        onClose={handleCloseRatesModal}
        onSave={handleSaveRatesModal}
        initialData={{
          geruRate: invoiceData.geruRate,
          whiteRate: invoiceData.whiteRate,
          jaipuriRate: invoiceData.jaipuriRate,
          damarRate: invoiceData.damarRate,
          goldRate: invoiceData.goldRate,
        }}
      />
    </div>
  );
};

export default CreateInvoice; 