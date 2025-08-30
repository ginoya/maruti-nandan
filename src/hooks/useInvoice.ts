import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { 
  updateInvoiceDetails, 
  updateInvoiceItem, 
  addInvoiceItem, 
  removeInvoiceItem,
  resetInvoice,
  setInvoiceData,
  type InvoiceData,
  type InvoiceItem 
} from '../store/invoiceSlice';
import { updateInvoiceRates } from '../store/invoiceSlice';
import { invoiceService } from '../services/invoiceService';
import { useState } from 'react';

export const useInvoice = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const invoiceData = useSelector((state: RootState) => state.invoice);

  const updateDetails = (details: Partial<Pick<InvoiceData, 'businessName' | 'customer' | 'invoiceNo' | 'invoiceDate'>>) => {
    dispatch(updateInvoiceDetails(details));
  };

  const updateItem = (id: number, item: Partial<InvoiceItem>) => {
    dispatch(updateInvoiceItem({ id, item }));
  };

  const addItem = (item: Omit<InvoiceItem, 'id' | 'no' | 'total'>) => {
    dispatch(addInvoiceItem(item));
  };

  const updateRates = (rates: Partial<Pick<InvoiceData, 'geruRate' | 'whiteRate' | 'jaipuriRate' | 'damarRate' | 'goldRate'>>) => {
    dispatch(updateInvoiceRates(rates));
  };

  const removeItem = (id: number) => {
    dispatch(removeInvoiceItem(id));
  };

  const reset = () => {
    dispatch(resetInvoice());
  };

  const loadInvoice = async (invoiceId: string) => {
    try {
      setIsLoading(true)
      const invoice = await invoiceService.getInvoiceById(invoiceId);
      if (invoice) {
        dispatch(setInvoiceData(invoice));
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading invoice:', error);
    }
  };

  const calculateTotals = () => {
    const weights = invoiceData.items.reduce(
      (acc, item) => {
        acc.geru += item.geru || 0;
        acc.white += item.white || 0;
        acc.jaipuri += item.jaipuri || 0;
        acc.damar += item.damar || 0;
        acc.gold += item.gold || 0;
        return acc;
      },
      { geru: 0, white: 0, jaipuri: 0, damar: 0, gold: 0 }
    );
    const rates = {
      geruRate: invoiceData.geruRate || 0,
      whiteRate: invoiceData.whiteRate || 0,
      jaipuriRate: invoiceData.jaipuriRate || 0,
      damarRate: invoiceData.damarRate || 0,
      goldRate: invoiceData.goldRate || 0,
    };
    const grandTotal =
      weights.geru * rates.geruRate +
      weights.white * rates.whiteRate +
      weights.jaipuri * rates.jaipuriRate +
      weights.damar * rates.damarRate +
      weights.gold * rates.goldRate;

    return {
      ...weights,
      ...rates,
      grandTotal,
      // Backward compatibility aliases
      total: grandTotal,
      amount: grandTotal,
    } as any;
  };

  return {
    invoiceData,
    updateDetails,
    updateRates,
    updateItem,
    addItem,
    removeItem,
    reset,
    loadInvoice,
    calculateTotals,
    isLoading
  };
}; 