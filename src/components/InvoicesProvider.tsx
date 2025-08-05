import React from 'react';

interface InvoicesProviderProps {
  children: React.ReactNode;
}

const InvoicesProvider: React.FC<InvoicesProviderProps> = ({ children }) => {
  // This will automatically fetch invoices on mount



  return <>{children}</>;
};

export default InvoicesProvider; 