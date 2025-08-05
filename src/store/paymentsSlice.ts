import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentService, type PaymentData, type FirebasePaymentData } from '../services/paymentService';

interface PaymentsState {
  data: FirebasePaymentData[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async () => {
    const payments = await paymentService.getAllPayments();
    return payments;
  }
);

export const addPayment = createAsyncThunk(
  'payments/addPayment',
  async (paymentData: PaymentData) => {
    const paymentId = await paymentService.savePayment(paymentData);
    return { id: paymentId, ...paymentData };
  }
);

// Async thunk to soft delete payment
export const softDeletePayment = createAsyncThunk(
  'payments/softDeletePayment',
  async (paymentId: string) => {
    await paymentService.softDeletePayment(paymentId);
    return paymentId;
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPayments: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payments';
      })
      // Add payment
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add payment';
      })
      // Soft delete payment
      .addCase(softDeletePayment.pending, (state) => {
        state.error = null;
      })
      .addCase(softDeletePayment.fulfilled, (state, action) => {
        // Remove the payment from the state
        state.data = state.data.filter(payment => payment.id !== action.payload);
      })
      .addCase(softDeletePayment.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete payment';
      });
  },
});

export const { clearPayments } = paymentsSlice.actions;
export default paymentsSlice.reducer; 