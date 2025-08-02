import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export interface Pedhi {
  id: string;
  name: string;
  // Add other fields as needed based on your Firebase collection structure
  [key: string]: any;
}

interface PedhisState {
  data: Pedhi[];
  loading: boolean;
  error: string | null;
}

const initialState: PedhisState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to fetch pedhis from Firebase
export const fetchPedhis = createAsyncThunk(
  'pedhis/fetchPedhis',
  async () => {
    try {
      const pedhisCollection = collection(db, 'pedhis');
      const pedhisSnapshot = await getDocs(pedhisCollection);
      const pedhisList = pedhisSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return pedhisList;
    } catch (error) {
      throw new Error('Failed to fetch pedhis');
    }
  }
);

const pedhisSlice = createSlice({
  name: 'pedhis',
  initialState,
  reducers: {
    clearPedhis: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPedhis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPedhis.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchPedhis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pedhis';
      });
  },
});

export const { clearPedhis } = pedhisSlice.actions;
export default pedhisSlice.reducer; 