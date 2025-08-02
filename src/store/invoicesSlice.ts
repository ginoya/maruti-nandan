import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { invoiceService, type FirebaseInvoiceData } from '../services/invoiceService';

export interface InvoicesState {
  invoices: FirebaseInvoiceData[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  loading: false,
  error: null
};

// Async thunk to fetch all invoices
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async () => {
    const invoices = await invoiceService.getAllInvoices();
    return invoices;
  }
);

// Async thunk to save invoice
export const saveInvoice = createAsyncThunk(
  'invoices/saveInvoice',
  async (invoiceData: any) => {
    const invoiceId = await invoiceService.saveInvoice(invoiceData);
    return { id: invoiceId, ...invoiceData };
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addInvoice: (state, action: PayloadAction<FirebaseInvoiceData>) => {
      state.invoices.unshift(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<{ id: string; invoice: Partial<FirebaseInvoiceData> }>) => {
      const index = state.invoices.findIndex(invoice => invoice.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = { ...state.invoices[index], ...action.payload.invoice };
      }
    },
    removeInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(invoice => invoice.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoices';
      })
      // Save invoice
      .addCase(saveInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveInvoice.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new invoice to the beginning of the list
        state.invoices.unshift(action.payload as FirebaseInvoiceData);
      })
      .addCase(saveInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save invoice';
      });
  }
});

export const { clearError, addInvoice, updateInvoice, removeInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer; 