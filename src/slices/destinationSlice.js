import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { destinations } from "../services/axios.js";

// ASYNC THUNKS
export const fetchAllDestinations = createAsyncThunk(
  "destination/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await destinations.getAll(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchDestinationBySlug = createAsyncThunk(
  "destination/getBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await destinations.getBySlug(slug);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// FIX: pass tier inside params object so getHotels(slug, params) receives it correctly
export const fetchDestinationHotels = createAsyncThunk(
  "destination/getHotels",
  async ({ slug, tier }, { rejectWithValue }) => {
    try {
      const params = tier && tier !== "all" ? { tier } : {};
      const res = await destinations.getHotels(slug, params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchDestinationAttractions = createAsyncThunk(
  "destination/getAttractions",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await destinations.getAttractions(slug);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchDestinationRestaurants = createAsyncThunk(
  "destination/getRestaurants",
  async ({ slug, params = {} }, { rejectWithValue }) => {
    try {
      const res = await destinations.getRestaurants(slug, params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// ─────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────

const initialState = {
  list: [],
  total: 0,
  current: null,
  hotels: [],
  attractions: [],
  restaurants: [],

  loading: {
    list: false,
    current: false,
    hotels: false,
    attractions: false,
    restaurants: false,
  },
  error: {
    list: null,
    current: null,
    hotels: null,
    attractions: null,
    restaurants: null,
  },
};

const destinationSlice = createSlice({
  name: "destination",
  initialState,

  reducers: {
    clearCurrentDestination: (state) => {
      state.current = null;
      state.hotels = [];
      state.attractions = [];
      state.restaurants = [];
    },
    clearDestinationError: (state, action) => {
      state.error[action.payload] = null;
    },
    // Allows pages to optimistically clear results when switching destinations
    clearDestinationHotels: (state) => {
      state.hotels = [];
    },
    clearDestinationRestaurants: (state) => {
      state.restaurants = [];
    },
  },

  extraReducers: (builder) => {
    // ── GET ALL ──────────────────────────────────────────────
    builder
      .addCase(fetchAllDestinations.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchAllDestinations.fulfilled, (state, action) => {
        state.loading.list = false;
        state.list = action.payload?.destinations || action.payload || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(fetchAllDestinations.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload;
      });

    // ── GET BY SLUG ──────────────────────────────────────────
    builder
      .addCase(fetchDestinationBySlug.pending, (state) => {
        state.loading.current = true;
        state.error.current = null;
      })
      .addCase(fetchDestinationBySlug.fulfilled, (state, action) => {
        state.loading.current = false;
        state.current = action.payload?.destination || action.payload;
      })
      .addCase(fetchDestinationBySlug.rejected, (state, action) => {
        state.loading.current = false;
        state.error.current = action.payload;
      });

    // ── GET HOTELS ───────────────────────────────────────────
    builder
      .addCase(fetchDestinationHotels.pending, (state) => {
        state.loading.hotels = true;
        state.error.hotels = null;
      })
      .addCase(fetchDestinationHotels.fulfilled, (state, action) => {
        state.loading.hotels = false;
        // Normalise: API may return { hotels: [...] } or [...] directly
        const raw = action.payload;
        state.hotels = Array.isArray(raw)
          ? raw
          : raw?.hotels || raw?.data || [];
      })
      .addCase(fetchDestinationHotels.rejected, (state, action) => {
        state.loading.hotels = false;
        state.error.hotels = action.payload;
      });

    // ── GET ATTRACTIONS ──────────────────────────────────────
    builder
      .addCase(fetchDestinationAttractions.pending, (state) => {
        state.loading.attractions = true;
        state.error.attractions = null;
      })
      .addCase(fetchDestinationAttractions.fulfilled, (state, action) => {
        state.loading.attractions = false;
        const raw = action.payload;
        state.attractions = Array.isArray(raw)
          ? raw
          : raw?.attractions || raw?.data || [];
      })
      .addCase(fetchDestinationAttractions.rejected, (state, action) => {
        state.loading.attractions = false;
        state.error.attractions = action.payload;
      });

    // ── GET RESTAURANTS ──────────────────────────────────────
    builder
      .addCase(fetchDestinationRestaurants.pending, (state) => {
        state.loading.restaurants = true;
        state.error.restaurants = null;
      })
      .addCase(fetchDestinationRestaurants.fulfilled, (state, action) => {
        state.loading.restaurants = false;
        const raw = action.payload;
        state.restaurants = Array.isArray(raw)
          ? raw
          : raw?.restaurants || raw?.data || [];
      })
      .addCase(fetchDestinationRestaurants.rejected, (state, action) => {
        state.loading.restaurants = false;
        state.error.restaurants = action.payload;
      });
  },
});

export const {
  clearCurrentDestination,
  clearDestinationError,
  clearDestinationHotels,
  clearDestinationRestaurants,
} = destinationSlice.actions;
export default destinationSlice.reducer;

// ─────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────
export const selectDestinations = (s) => s.destination.list;
export const selectDestinationsTotal = (s) => s.destination.total;
export const selectCurrentDestination = (s) => s.destination.current;
export const selectDestinationHotels = (s) => s.destination.hotels;
export const selectDestinationAttractions = (s) => s.destination.attractions;
export const selectDestinationRestaurants = (s) => s.destination.restaurants;
export const selectDestinationLoading = (s) => s.destination.loading;
export const selectDestinationError = (s) => s.destination.error;
