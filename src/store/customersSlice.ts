import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomers } from '../services/customerService';

export interface Customer {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomersState {
  data: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to fetch customers from Firebase
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    try {
      const customers = await getCustomers();
      return customers;
    } catch (error) {
      throw new Error('Failed to fetch customers');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomers: (state) => {
      state.data = [];
      state.error = null;
    },
    addCustomerToState: (state, action) => {
      state.data.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customers';
      });
  },
});

export const { clearCustomers, addCustomerToState } = customersSlice.actions;
export default customersSlice.reducer; 