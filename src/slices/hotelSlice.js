import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { hotels } from '../services/axios.js';

// ASYNC THUNKS

export const fetchAllHotels = createAsyncThunk(
  'hotel/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await hotels.getAll(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotel/getById',
  async (hotelId, { rejectWithValue }) => {
    try {
      const res = await hotels.getById(hotelId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// SLICE

const initialState = {
  list: [],
  current: null,

  loading: {
    list: false,
    current: false,
  },
  error: {
    list: null,
    current: null,
  },
};

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,

  reducers: {
    clearCurrentHotel: (state) => { state.current = null; },
    clearHotelError: (state, action) => { state.error[action.payload] = null; },
  },

  extraReducers: (builder) => {

    // ── GET ALL ──────────────────────────────────────────────
    builder
      .addCase(fetchAllHotels.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchAllHotels.fulfilled, (state, action) => {
        state.loading.list = false;
        state.list = action.payload?.hotels || action.payload || [];
      })
      .addCase(fetchAllHotels.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload;
      });

    // ── GET BY ID ────────────────────────────────────────────
    builder
      .addCase(fetchHotelById.pending, (state) => {
        state.loading.current = true;
        state.error.current = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading.current = false;
        state.current = action.payload?.hotel || action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading.current = false;
        state.error.current = action.payload;
      });
  },
});

export const { clearCurrentHotel, clearHotelError } = hotelSlice.actions;
export default hotelSlice.reducer;

// SELECTORS
export const selectHotels = (s) => s.hotel.list;
export const selectCurrentHotel = (s) => s.hotel.current;
export const selectHotelLoading = (s) => s.hotel.loading;
export const selectHotelError = (s) => s.hotel.error;