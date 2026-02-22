import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { restaurants } from '../services/axios.js';

// ASYNC THUNKS

export const fetchAllRestaurants = createAsyncThunk(
  'restaurant/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await restaurants.getAll(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurant/getById',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const res = await restaurants.getById(restaurantId);
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

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,

  reducers: {
    clearCurrentRestaurant: (state) => { state.current = null; },
    clearRestaurantError: (state, action) => { state.error[action.payload] = null; },
  },

  extraReducers: (builder) => {

    // ── GET ALL ──────────────────────────────────────────────
    builder
      .addCase(fetchAllRestaurants.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchAllRestaurants.fulfilled, (state, action) => {
        state.loading.list = false;
        state.list = action.payload?.restaurants || action.payload || [];
      })
      .addCase(fetchAllRestaurants.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload;
      });

    // ── GET BY ID ────────────────────────────────────────────
    builder
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading.current = true;
        state.error.current = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading.current = false;
        state.current = action.payload?.restaurant || action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading.current = false;
        state.error.current = action.payload;
      });
  },
});

export const { clearCurrentRestaurant, clearRestaurantError } = restaurantSlice.actions;
export default restaurantSlice.reducer;

// SELECTORS
export const selectRestaurants = (s) => s.restaurant.list;
export const selectCurrentRestaurant = (s) => s.restaurant.current;
export const selectRestaurantLoading = (s) => s.restaurant.loading;
export const selectRestaurantError = (s) => s.restaurant.error;