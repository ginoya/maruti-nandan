import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface InvoiceItem {
  id: number;
  no: string;
  particular: string;
  jodi: number;
  box: number;
  jodiTotal: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  businessName: string;
  customer: string;
  invoiceNo: string;
  invoiceDate: string;
  items: InvoiceItem[];
}

const initialState: InvoiceData = {
  businessName: '',
  customer: '',
  invoiceNo: '',
  invoiceDate: '',
  // items: Array.from({ length: 0 }, (_, index) => {
  //   let tempBox = Math.floor(Math.random() * 30) + 10;
  //   let tempRate = Math.floor(Math.random() * 5) + 10;
  //   return {
  //     id: index + 1,
  //     no: (index + 1).toString(),
  //     particular: index % 3 === 0 ? 'silver' : index % 3 === 1 ? 'golden' : 'bronze',
  //     jodi: 60,
  //     box: tempBox,
  //     jodiTotal: tempBox * 60,
  //     rate: tempRate,
  //     amount: tempBox * 60 * tempRate
  //   };
  // }).map(item => ({
  //   ...item,
  //   jodiTotal: item.jodi * item.box,
  //   amount: item.jodiTotal * item.rate
  // })),
  items: []
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    updateInvoiceDetails: (state, action: PayloadAction<Partial<Pick<InvoiceData, 'businessName' | 'customer' | 'invoiceNo' | 'invoiceDate'>>>) => {
      return { ...state, ...action.payload };
    },
    updateInvoiceItem: (state, action: PayloadAction<{ id: number; item: Partial<InvoiceItem> }>) => {
      const { id, item } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...item };
        // Recalculate totals
        const updatedItem = state.items[index];
        updatedItem.jodiTotal = updatedItem.jodi * updatedItem.box;
        updatedItem.amount = updatedItem.jodiTotal * updatedItem.rate;
      }
    },
    addInvoiceItem: (state, action: PayloadAction<Omit<InvoiceItem, 'id'>>) => {
      const newId = state.items.length > 0 ? Math.max(...state.items.map(item => item.id)) + 1 : 1;
      const newItem: InvoiceItem = {
        ...action.payload,
        id: newId,
        no: (state.items.length + 1).toString(),
        jodiTotal: action.payload.jodi * action.payload.box,
        amount: (action.payload.jodi * action.payload.box) * action.payload.rate
      };
      state.items.push(newItem);
    },
    removeInvoiceItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      // Renumber items
      state.items.forEach((item, index) => {
        item.no = (index + 1).toString();
      });
    },
    resetInvoice: () => initialState
  },
});

export const { 
  updateInvoiceDetails, 
  updateInvoiceItem, 
  addInvoiceItem, 
  removeInvoiceItem,
  resetInvoice 
} = invoiceSlice.actions;

export default invoiceSlice.reducer; 