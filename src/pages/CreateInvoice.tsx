import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Button, Input } from '../components/ui';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface InvoiceItem {
  id: number;
  no: string;
  particular: string;
  jodi: number;
  box: number;
  jodiTotal: number;
  rate: number;
  amount: number;
}

const CreateInvoice: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState({
    businessName: 'JAY BALAJI ENTERPRISE',
    clientName: 'GNG',
    invoiceNo: '5',
    invoiceDate: '25/07/2025',
    items: Array.from({ length: 28 }, (_, index) => {
      let tempBox = Math.floor(Math.random() * 30) + 10;
      let tempRate = Math.floor(Math.random() * 5) + 10;
       return{
      id: index + 1,
      no: (index + 1).toString(),
      particular: index % 3 === 0 ? 'silver' : index % 3 === 1 ? 'golden' : 'bronze',
      jodi: 60,
      box: tempBox,
      jodiTotal: tempBox * 60,
      rate: tempRate,
      amount: tempBox * 60 * tempRate
    }}).map(item => ({
      ...item,
      jodiTotal: item.jodi * item.box,
      amount: item.jodiTotal * item.rate
    })) as InvoiceItem[]
  });

  const calculateTotals = () => {
    const totals = invoiceData.items.reduce((acc, item) => {
      acc.box += item.box;
      acc.jodiTotal += item.jodiTotal;
      acc.amount += item.amount;
      return acc;
    }, { box: 0, jodiTotal: 0, amount: 0 });
    return totals;
  };

  const totals = calculateTotals();

  const handleGenerateInvoice = async () => {
    try {
      await generateInvoicePDF(`invoice-${invoiceData.invoiceNo}-${invoiceData.invoiceDate.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      // You can add a toast notification here if you have a notification system
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
            <div className="text-lg text-gray-600 mb-sm">શ્રી ગણેશાય નમઃ</div>
            <h2 className="text-2xl font-bold text-blue-600 mb-lg">{invoiceData.businessName}</h2>
          </div>

          {/* Client and Invoice Information Table */}
          <div className="mb-lg">
            <table className="w-full border-collapse border border-blue-300 invoice-detail-table">
              <tbody>
                <tr>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 font-medium" colSpan={2} rowSpan={2}>{`M/S. : ${invoiceData.clientName}`}</td>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 font-medium">Invoice No.:</td>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700">{invoiceData.invoiceNo}</td>
                </tr>
                <tr>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700 font-medium">Invoice Date:</td>
                  <td className="border border-blue-300 px-md py-sm text-sm text-gray-700" colSpan={1}>{invoiceData.invoiceDate}</td>
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
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Particular</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Jodi</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Box</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Jodi Total</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Rate</th>
                  <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.no}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.particular}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.jodi}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.box}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.jodiTotal}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.rate}</span></td>
                    <td className="border border-blue-300 px-md py-sm text-sm text-gray-700"><span className='number-span'>{item.amount}</span></td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="bg-gray-50">
                  <td className="border border-blue-300 px-md text-sm text-gray-700"></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700">{totals.box}</td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700">{totals.jodiTotal}</td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700"></td>
                  <td className="border border-blue-300 px-md text-sm text-gray-700">{totals.amount}</td>
                </tr>

                <tr className="bg-gray-50 font-bold">
                  <td className="border border-blue-300 px-md py-sm text-lg text-gray-700" colSpan={4}>Grand Total</td>
                  <td className="border border-blue-300 px-md py-sm text-lg text-gray-700" colSpan={3}>{totals.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
      {/* Generate Invoice Button - Sticky at bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-xs py-lg bg-transparent">
        <div className="flex gap-sm">
          <Button 
            variant="gradient" 
            size="md" 
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center !border-radius-50"
            style={{ borderRadius: '50%' }}
            onClick={() => console.log('Add new item')}
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
            onClick={() => console.log('Edit invoice')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
        </div>
        <Button variant="gradient" size="md" onClick={handleGenerateInvoice}>
          Print
        </Button>
      </div>
    </div>
  );
};

export default CreateInvoice; 