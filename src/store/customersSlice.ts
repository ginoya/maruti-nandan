import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomers, softDeleteCustomer } from '../services/customerService';

export interface Customer {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

interface CustomersState {
  data: Customer[] | any;
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

// Async thunk to soft delete a customer
export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (customerId: string) => {
    try {
      await softDeleteCustomer(customerId);
      return customerId;
    } catch (error) {
      throw new Error('Failed to delete customer');
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
    removeCustomerFromState: (state, action) => {
      state.data = state.data.filter((customer: Customer) => customer.id !== action.payload);
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
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((customer: Customer) => customer.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete customer';
      });
  },
});

export const { clearCustomers, addCustomerToState, removeCustomerFromState } = customersSlice.actions;
export default customersSlice.reducer; 