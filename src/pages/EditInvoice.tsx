import React from 'react';
import { useParams } from 'react-router-dom';
import InvoiceForm from './CreateInvoice';

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invoice ID not found</h1>
          <p className="text-gray-600">Please provide a valid invoice ID to edit.</p>
        </div>
      </div>
    );
  }

  return <InvoiceForm mode="edit" invoiceId={id} />;
};

export default EditInvoice; 