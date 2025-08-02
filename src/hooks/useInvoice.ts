import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { 
  updateInvoiceDetails, 
  updateInvoiceItem, 
  addInvoiceItem, 
  removeInvoiceItem,
  resetInvoice,
  type InvoiceData,
  type InvoiceItem 
} from '../store/invoiceSlice';

export const useInvoice = () => {
  const dispatch = useDispatch();
  const invoiceData = useSelector((state: RootState) => state.invoice);

  const updateDetails = (details: Partial<Pick<InvoiceData, 'businessName' | 'customer' | 'invoiceNo' | 'invoiceDate'>>) => {
    dispatch(updateInvoiceDetails(details));
  };

  const updateItem = (id: number, item: Partial<InvoiceItem>) => {
    dispatch(updateInvoiceItem({ id, item }));
  };

  const addItem = (item: Omit<InvoiceItem, 'id'>) => {
    dispatch(addInvoiceItem(item));
  };

  const removeItem = (id: number) => {
    dispatch(removeInvoiceItem(id));
  };

  const reset = () => {
    dispatch(resetInvoice());
  };

  const calculateTotals = () => {
    const totals = invoiceData.items.reduce((acc, item) => {
      acc.box += item.box;
      acc.jodiTotal += item.jodiTotal;
      acc.amount += item.amount;
      return acc;
    }, { box: 0, jodiTotal: 0, amount: 0 });
    return totals;
  };

  return {
    invoiceData,
    updateDetails,
    updateItem,
    addItem,
    removeItem,
    reset,
    calculateTotals
  };
}; 