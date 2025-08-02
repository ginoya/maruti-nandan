import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { fetchInvoices, saveInvoice, clearError } from '../store/invoicesSlice';

export const useInvoices = () => {
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector((state: RootState) => state.invoices);

  // Fetch invoices on mount
  useEffect(() => {
    dispatch(fetchInvoices() as any);
  }, [dispatch]);

  const saveInvoiceToFirebase = async (invoiceData: any) => {
    try {
      await dispatch(saveInvoice(invoiceData) as any).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to save invoice:', error);
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
    clearErrorMessage,
    refetch: () => dispatch(fetchInvoices() as any)
  };
}; 