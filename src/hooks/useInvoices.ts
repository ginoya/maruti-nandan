import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { fetchInvoices, saveInvoice, clearError } from '../store/invoicesSlice';
import { invoiceService } from '../services/invoiceService';

export const useInvoices = () => {
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector((state: RootState) => state.invoices);

  // Fetch invoices on mount
  useEffect(() => {
    dispatch(fetchInvoices() as any);
  }, [dispatch]);

  const saveInvoiceToFirebase = async (invoiceData: any, incrementCounter: boolean = true) => {
    try {
      await dispatch(saveInvoice({ invoiceData, incrementCounter }) as any).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to save invoice:', error);
      return false;
    }
  };

  const updateInvoiceInFirebase = async (invoiceId: string, invoiceData: any) => {
    try {
      await invoiceService.updateInvoice(invoiceId, invoiceData);
      return true;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      return false;
    }
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  return {
    invoices,
    loading,
    error,
    saveInvoiceToFirebase,
    updateInvoiceInFirebase,
    clearErrorMessage,
    refetch: () => dispatch(fetchInvoices() as any)
  };
}; 