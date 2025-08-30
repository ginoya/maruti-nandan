import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface InvoiceItem {
  id: number;
  no: string;
  date: string; // DD-MM-YYYY
  geru: number;
  white: number;
  jaipuri: number;
  damar: number;
  gold: number;
  total: number;
}

export interface InvoiceData {
  businessName: string;
  customer: string;
  invoiceNo: string;
  invoiceDate: string;
  items: InvoiceItem[];
  geruRate: number;
  whiteRate: number;
  jaipuriRate: number;
  damarRate: number;
  goldRate: number;
  grandTotal?: number;
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
  items: [],
  geruRate: 0,
  whiteRate: 0,
  jaipuriRate: 0,
  damarRate: 0,
  goldRate: 0,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    updateInvoiceDetails: (state, action: PayloadAction<Partial<Pick<InvoiceData, 'businessName' | 'customer' | 'invoiceNo' | 'invoiceDate'>>>) => {
      return { ...state, ...action.payload };
    },
    updateInvoiceRates: (state, action: PayloadAction<Partial<Pick<InvoiceData, 'geruRate' | 'whiteRate' | 'jaipuriRate' | 'damarRate' | 'goldRate'>>>) => {
      return { ...state, ...action.payload };
    },
    setInvoiceData: (state, action: PayloadAction<InvoiceData>) => {
      return { ...action.payload };
    },
    updateInvoiceItem: (state, action: PayloadAction<{ id: number; item: Partial<InvoiceItem> }>) => {
      const { id, item } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...item };
        // Recalculate total
        const updatedItem = state.items[index];
        updatedItem.total =
          (updatedItem.geru || 0) +
          (updatedItem.white || 0) +
          (updatedItem.jaipuri || 0) +
          (updatedItem.damar || 0) +
          (updatedItem.gold || 0);
      }
    },
    addInvoiceItem: (state, action: PayloadAction<Omit<InvoiceItem, 'id' | 'no' | 'total'>>) => {
      const newId = state.items.length > 0 ? Math.max(...state.items.map(item => item.id)) + 1 : 1;
      const payload = action.payload as any;
      const newItem: InvoiceItem = {
        id: newId,
        no: (state.items.length + 1).toString(),
        date: payload.date,
        geru: payload.geru ?? 0,
        white: payload.white ?? 0,
        jaipuri: payload.jaipuri ?? 0,
        damar: payload.damar ?? 0,
        gold: payload.gold ?? 0,
        total:
          (payload.geru ?? 0) +
          (payload.white ?? 0) +
          (payload.jaipuri ?? 0) +
          (payload.damar ?? 0) +
          (payload.gold ?? 0),
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
  resetInvoice,
  updateInvoiceRates,
  setInvoiceData,
} = invoiceSlice.actions;

export default invoiceSlice.reducer; 