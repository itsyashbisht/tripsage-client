import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { itineraries } from '../services/axios.js';

// ASYNC THUNKS

export const fetchAllItineraries = createAsyncThunk(
  'itinerary/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await itineraries.getAll();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchItineraryById = createAsyncThunk(
  'itinerary/getById',
  async (itineraryId, { rejectWithValue }) => {
    try {
      const res = await itineraries.getById(itineraryId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchItineraryByToken = createAsyncThunk(
  'itinerary/getByToken',
  async (shareToken, { rejectWithValue }) => {
    try {
      const res = await itineraries.getByToken(shareToken);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUserSavedItineraries = createAsyncThunk(
  'itinerary/getUserSaved',
  async (_, { rejectWithValue }) => {
    try {
      const res = await itineraries.getUserSaved();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteItinerary = createAsyncThunk(
  'itinerary/delete',
  async (itineraryId, { rejectWithValue }) => {
    try {
      await itineraries.delete(itineraryId);
      return itineraryId;    // return id to remove from list
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const saveItinerary = createAsyncThunk(
  'itinerary/save',
  async ({ itineraryId, note = '' }, { rejectWithValue }) => {
    try {
      const res = await itineraries.save(itineraryId, note);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const unsaveItinerary = createAsyncThunk(
  'itinerary/unsave',
  async (itineraryId, { rejectWithValue }) => {
    try {
      await itineraries.unsave(itineraryId);
      return itineraryId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const shareItinerary = createAsyncThunk(
  'itinerary/share',
  async ({ itineraryId, platform = 'link' }, { rejectWithValue }) => {
    try {
      const res = await itineraries.share(itineraryId, platform);
      return res.data;    // { shareUrl, shareToken, share }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// SLICE

const initialState = {
  list: [],          // user's itineraries
  saved: [],          // user's saved plans
  current: null,        // single itinerary being viewed
  shareData: null,        // { shareUrl, shareToken } after sharing

  loading: {
    list: false,
    saved: false,
    current: false,
    delete: false,
    save: false,
    unsave: false,
    share: false,
  },
  error: {
    list: null,
    saved: null,
    current: null,
    delete: null,
    save: null,
    unsave: null,
    share: null,
  },
  success: {
    save: false,
    unsave: false,
    delete: false,
    share: false,
  },
};

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,

  reducers: {
    clearCurrentItinerary: (state) => { state.current = null; },
    clearShareData: (state) => { state.shareData = null; },
    clearItinerarySuccess: (state, action) => { state.success[action.payload] = false; },
    clearItineraryError: (state, action) => { state.error[action.payload] = null; },
    // Directly set itinerary from router state (AI generation result bypasses fetch)
    setCurrentItinerary: (state, action) => { state.current = action.payload; },
  },

  extraReducers: (builder) => {

    // ── GET ALL (user's list) ────────────────────────────────
    builder
      .addCase(fetchAllItineraries.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchAllItineraries.fulfilled, (state, action) => {
        state.loading.list = false;
        state.list = action.payload?.itineraries || action.payload || [];
      })
      .addCase(fetchAllItineraries.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload;
      });

    // ── GET BY ID ────────────────────────────────────────────
    builder
      .addCase(fetchItineraryById.pending, (state) => {
        state.loading.current = true;
        state.error.current = null;
      })
      .addCase(fetchItineraryById.fulfilled, (state, action) => {
        state.loading.current = false;
        state.current = action.payload?.itinerary || action.payload;
      })
      .addCase(fetchItineraryById.rejected, (state, action) => {
        state.loading.current = false;
        state.error.current = action.payload;
      });

    // ── GET BY SHARE TOKEN (public link) ─────────────────────
    builder
      .addCase(fetchItineraryByToken.pending, (state) => {
        state.loading.current = true;
        state.error.current = null;
      })
      .addCase(fetchItineraryByToken.fulfilled, (state, action) => {
        state.loading.current = false;
        state.current = action.payload?.itinerary || action.payload;
      })
      .addCase(fetchItineraryByToken.rejected, (state, action) => {
        state.loading.current = false;
        state.error.current = action.payload;
      });

    // ── GET USER SAVED ───────────────────────────────────────
    builder
      .addCase(fetchUserSavedItineraries.pending, (state) => {
        state.loading.saved = true;
        state.error.saved = null;
      })
      .addCase(fetchUserSavedItineraries.fulfilled, (state, action) => {
        state.loading.saved = false;
        state.saved = action.payload?.saved || action.payload || [];
      })
      .addCase(fetchUserSavedItineraries.rejected, (state, action) => {
        state.loading.saved = false;
        state.error.saved = action.payload;
      });

    // ── DELETE ───────────────────────────────────────────────
    builder
      .addCase(deleteItinerary.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
        state.success.delete = false;
      })
      .addCase(deleteItinerary.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success.delete = true;
        state.list = state.list.filter(i => i._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
      })
      .addCase(deleteItinerary.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      });

    // ── SAVE ─────────────────────────────────────────────────
    builder
      .addCase(saveItinerary.pending, (state) => {
        state.loading.save = true;
        state.error.save = null;
        state.success.save = false;
      })
      .addCase(saveItinerary.fulfilled, (state) => {
        state.loading.save = false;
        state.success.save = true;
      })
      .addCase(saveItinerary.rejected, (state, action) => {
        state.loading.save = false;
        state.error.save = action.payload;
      });

    // ── UNSAVE ───────────────────────────────────────────────
    builder
      .addCase(unsaveItinerary.pending, (state) => {
        state.loading.unsave = true;
        state.error.unsave = null;
        state.success.unsave = false;
      })
      .addCase(unsaveItinerary.fulfilled, (state, action) => {
        state.loading.unsave = false;
        state.success.unsave = true;
        state.saved = state.saved.filter(s => s.itinerary?._id !== action.payload);
      })
      .addCase(unsaveItinerary.rejected, (state, action) => {
        state.loading.unsave = false;
        state.error.unsave = action.payload;
      });

    // ── SHARE ────────────────────────────────────────────────
    builder
      .addCase(shareItinerary.pending, (state) => {
        state.loading.share = true;
        state.error.share = null;
        state.success.share = false;
        state.shareData = null;
      })
      .addCase(shareItinerary.fulfilled, (state, action) => {
        state.loading.share = false;
        state.success.share = true;
        state.shareData = action.payload;    // { shareUrl, shareToken }
      })
      .addCase(shareItinerary.rejected, (state, action) => {
        state.loading.share = false;
        state.error.share = action.payload;
      });
  },
});

export const {
  clearCurrentItinerary,
  clearShareData,
  clearItinerarySuccess,
  clearItineraryError,
  setCurrentItinerary,
} = itinerarySlice.actions;

export default itinerarySlice.reducer;

// SELECTORS
export const selectItineraries = (s) => s.itinerary.list;
export const selectSavedItineraries = (s) => s.itinerary.saved;
export const selectCurrentItinerary = (s) => s.itinerary.current;
export const selectShareData = (s) => s.itinerary.shareData;
export const selectItineraryLoading = (s) => s.itinerary.loading;
export const selectItineraryError = (s) => s.itinerary.error;
export const selectItinerarySuccess = (s) => s.itinerary.success;