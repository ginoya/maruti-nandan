import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { invoiceService } from '../services/invoiceService';
import type { FirebaseInvoiceData } from '../services/invoiceService';

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState<FirebaseInvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        setError('Invoice ID not found');
        setLoading(false);
        return;
      }

      try {
        const invoice = await invoiceService.getInvoiceById(id);
        if (invoice) {
          setInvoiceData(invoice);
        } else {
          setError('Invoice not found');
        }
      } catch (err) {
        setError('Failed to load invoice');
        console.error('Error fetching invoice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleBack = () => {
    navigate('/invoice');
  };

  const handlePrint = async () => {
    if (!invoiceData) return;

    try {
              await generateInvoicePDF(`invoice-${invoiceData.invoiceNo}-${invoiceData.invoiceDate}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const calculateTotals = () => {
    if (!invoiceData) return { box: 0, jodiTotal: 0, amount: 0 };

    return invoiceData.items.reduce((totals, item) => ({
      box: totals.box + item.box,
      jodiTotal: totals.jodiTotal + item.jodiTotal,
      amount: totals.amount + item.amount
    }), { box: 0, jodiTotal: 0, amount: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading invoice...</div>
        </div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error || 'Invoice not found'}</div>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div style={{paddingBottom: '50px'}}>
        <div className="py-xl print-this pb-20">
          {/* Invoice Form */}
          <div>
            {/* Invoice Header */}
            <div className="text-center mb-xl">
              <div className="text-lg text-red-900 mb-sm">શ્રી ગણેશાય નમઃ</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-lg">{invoiceData.businessName}</h2>
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
                    <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Particular</th>
                    <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Jodi</th>
                    <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Box</th>
                    <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Jodi Total</th>
                    <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Rate</th>
                    <th className="border border-blue-300 px-md py-sm text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
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
      
      {/* Action Buttons - Sticky at bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-xs py-lg" style={{ background: 'linear-gradient(to bottom, transparent, white)' }}>
        <Button 
          variant="outline" 
          size="md" 
          onClick={handleBack}
          className="flex items-center gap-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Button>
        <Button variant="gradient" size="md" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </div>
  );
};

export default ViewInvoice; 