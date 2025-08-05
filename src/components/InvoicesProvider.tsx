import React from 'react';
import { useInvoices } from '../hooks/useInvoices';

interface InvoicesProviderProps {
  children: React.ReactNode;
}

const InvoicesProvider: React.FC<InvoicesProviderProps> = ({ children }) => {
  // This will automatically fetch invoices on mount



  return <>{children}</>;
};

export default InvoicesProvider; 