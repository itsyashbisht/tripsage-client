import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { reviews } from '../services/axios.js';

// ASYNC THUNKS
export const fetchReviews = createAsyncThunk(
  'review/getAll',
  async (destinationId, { rejectWithValue }) => {
    try {
      const res = await reviews.getAll(destinationId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'review/add',
  async (reviewData, { rejectWithValue }) => {
    try {
      const res = await reviews.add(reviewData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeReview = createAsyncThunk(
  'review/remove',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviews.remove(reviewId);
      return reviewId;    // return id to optimistically remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// SLICE

const initialState = {
  list: [],

  loading: {
    list: false,
    add: false,
    remove: false,
  },
  error: {
    list: null,
    add: null,
    remove: null,
  },
  success: {
    add: false,
    remove: false,
  },
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,

  reducers: {
    clearReviewSuccess: (state, action) => { state.success[action.payload] = false; },
    clearReviewError: (state, action) => { state.error[action.payload] = null; },
    clearReviews: (state) => { state.list = []; },
  },

  extraReducers: (builder) => {

    // ── GET ALL ──────────────────────────────────────────────
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading.list = false;
        state.list = action.payload?.reviews || action.payload || [];
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload;
      });

    // ── ADD ──────────────────────────────────────────────────
    builder
      .addCase(addReview.pending, (state) => {
        state.loading.add = true;
        state.error.add = null;
        state.success.add = false;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading.add = false;
        state.success.add = true;
        // Optimistically prepend new review
        const newReview = action.payload?.review || action.payload;
        if (newReview) state.list.unshift(newReview);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading.add = false;
        state.error.add = action.payload;
      });

    // ── REMOVE ───────────────────────────────────────────────
    builder
      .addCase(removeReview.pending, (state) => {
        state.loading.remove = true;
        state.error.remove = null;
        state.success.remove = false;
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        state.loading.remove = false;
        state.success.remove = true;
        state.list = state.list.filter(r => r._id !== action.payload);
      })
      .addCase(removeReview.rejected, (state, action) => {
        state.loading.remove = false;
        state.error.remove = action.payload;
      });
  },
});

export const { clearReviewSuccess, clearReviewError, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;

// SELECTORS
export const selectReviews = (s) => s.review.list;
export const selectReviewLoading = (s) => s.review.loading;
export const selectReviewError = (s) => s.review.error;
export const selectReviewSuccess = (s) => s.review.success;