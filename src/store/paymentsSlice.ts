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
      });
  },
});

export const { clearPayments } = paymentsSlice.actions;
export default paymentsSlice.reducer; 