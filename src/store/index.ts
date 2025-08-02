import { configureStore } from '@reduxjs/toolkit';
import pedhisReducer from './pedhisSlice';
import customersReducer from './customersSlice';
import invoiceReducer from './invoiceSlice';
import invoicesReducer from './invoicesSlice';
import paymentsReducer from './paymentsSlice';

export const store = configureStore({
  reducer: {
    pedhis: pedhisReducer,
    customers: customersReducer,
    invoice: invoiceReducer,
    invoices: invoicesReducer,
    payments: paymentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 