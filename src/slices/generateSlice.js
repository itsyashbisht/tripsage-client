import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { generate } from '../services/axios.js';

// ASYNC THUNKS

// Full AI itinerary generation — calls Claude, saves to MongoDB
export const generateItinerary = createAsyncThunk(
  'generate/itinerary',
  async (tripParams, { rejectWithValue }) => {
    try {
      const res = await generate.itinerary(tripParams);
      return res.data;    // { itinerary, shareUrl, meta }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Instant math-based package pricing — no AI call, fast
export const fetchPackagePrices = createAsyncThunk(
  'generate/packages',
  async (params, { rejectWithValue }) => {
    try {
      const res = await generate.packages(params);
      return res.data;    // { packages: { economy, standard, luxury } }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// SLICE
const initialState = {
  // Generated itinerary result
  generatedItinerary: null,
  shareUrl: null,
  meta: null,         // { generationTimeMs, travelTips, localPhrases, ... }

  // Package price estimates shown on PlannerPage before generation
  packages: null,         // { economy, standard, luxury }

  // Form state — persisted so PlannerPage stays filled on back-navigation
  plannerForm: {
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    days: 3,
    adults: 2,
    children: 0,
    tier: 'standard',
    interests: [],
    dailyBudget: 3000,
  },

  loading: {
    generating: false,
    packages: false,
  },
  error: {
    generating: null,
    packages: null,
  },
};

const generateSlice = createSlice({
  name: 'generate',
  initialState,

  reducers: {
    // Persist planner form values in Redux so they survive page re-renders
    setPlannerForm: (state, action) => {
      state.plannerForm = { ...state.plannerForm, ...action.payload };
    },
    // Reset plannerForm back to defaults
    resetPlannerForm: (state) => {
      state.plannerForm = initialState.plannerForm;
    },
    // Clear generation results (e.g. when starting a new plan)
    clearGenerated: (state) => {
      state.generatedItinerary = null;
      state.shareUrl = null;
      state.meta = null;
    },
    clearGenerateError: (state, action) => {
      state.error[action.payload] = null;
    },
  },

  extraReducers: (builder) => {

    // ── GENERATE ITINERARY (AI) ──────────────────────────────
    builder
      .addCase(generateItinerary.pending, (state) => {
        state.loading.generating = true;
        state.error.generating = null;
        state.generatedItinerary = null;
        state.shareUrl = null;
        state.meta = null;
      })
      .addCase(generateItinerary.fulfilled, (state, action) => {
        state.loading.generating = false;
        state.generatedItinerary = action.payload?.itinerary || action.payload;
        state.shareUrl = action.payload?.shareUrl || null;
        state.meta = action.payload?.meta || null;
      })
      .addCase(generateItinerary.rejected, (state, action) => {
        state.loading.generating = false;
        state.error.generating = action.payload;
      });

    // ── PACKAGE PRICES (instant math) ───────────────────────
    builder
      .addCase(fetchPackagePrices.pending, (state) => {
        state.loading.packages = true;
        state.error.packages = null;
      })
      .addCase(fetchPackagePrices.fulfilled, (state, action) => {
        state.loading.packages = false;
        state.packages = action.payload?.packages || action.payload;
      })
      .addCase(fetchPackagePrices.rejected, (state, action) => {
        state.loading.packages = false;
        state.error.packages = action.payload;
      });
  },
});

export const {
  setPlannerForm,
  resetPlannerForm,
  clearGenerated,
  clearGenerateError,
} = generateSlice.actions;

export default generateSlice.reducer;

// SELECTORS
export const selectGeneratedItinerary = (s) => s.generate.generatedItinerary;
export const selectShareUrl = (s) => s.generate.shareUrl;
export const selectGenerateMeta = (s) => s.generate.meta;
export const selectPackages = (s) => s.generate.packages;
export const selectPlannerForm = (s) => s.generate.plannerForm;
export const selectGenerateLoading = (s) => s.generate.loading;
export const selectGenerateError = (s) => s.generate.error;