import React from 'react';
import { useInvoices } from '../hooks/useInvoices';

interface InvoicesProviderProps {
  children: React.ReactNode;
}

const InvoicesProvider: React.FC<InvoicesProviderProps> = ({ children }) => {
  // This will automatically fetch invoices on mount
  const { loading, error } = useInvoices();

  // You can add loading or error handling here if needed
  if (loading) {
    console.log('Loading invoices...');
  }

  if (error) {
    console.error('Error loading invoices:', error);
  }

  return <>{children}</>;
};

export default InvoicesProvider; 