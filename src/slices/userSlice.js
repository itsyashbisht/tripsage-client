import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { users } from '../services/axios.js';

// ASYNC THUNKS
export const fetchUserProfile = createAsyncThunk(
  'user/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await users.getMe();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  'user/updateDetails',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await users.updateDetails(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const res = await users.changePassword(passwordData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchSavedPlans = createAsyncThunk(
  'user/getSaved',
  async (_, { rejectWithValue }) => {
    try {
      const res = await users.getSaved();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeSavedPlan = createAsyncThunk(
  'user/removeSaved',
  async (itineraryId, { rejectWithValue }) => {
    try {
      await users.removeSaved(itineraryId);
      return itineraryId;   // return id so we can remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// SLICE
const initialState = {
  profile: null,
  savedPlans: [],

  loading: {
    profile: false,
    updateDetails: false,
    changePassword: false,
    savedPlans: false,
    removeSaved: false,
  },
  error: {
    profile: null,
    updateDetails: null,
    changePassword: null,
    savedPlans: null,
    removeSaved: null,
  },
  success: {
    updateDetails: false,
    changePassword: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    clearUserSuccess: (state, action) => {
      state.success[action.payload] = false;
    },
    clearUserError: (state, action) => {
      state.error[action.payload] = null;
    },
    resetUser: () => initialState,
  },

  extraReducers: (builder) => {

    // ── FETCH PROFILE ────────────────────────────────────────
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.payload;
      });

    // ── UPDATE DETAILS ───────────────────────────────────────
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.loading.updateDetails = true;
        state.error.updateDetails = null;
        state.success.updateDetails = false;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading.updateDetails = false;
        state.profile = { ...state.profile, ...action.payload };
        state.success.updateDetails = true;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading.updateDetails = false;
        state.error.updateDetails = action.payload;
      });

    // ── CHANGE PASSWORD ──────────────────────────────────────
    builder
      .addCase(changeUserPassword.pending, (state) => {
        state.loading.changePassword = true;
        state.error.changePassword = null;
        state.success.changePassword = false;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.loading.changePassword = false;
        state.success.changePassword = true;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading.changePassword = false;
        state.error.changePassword = action.payload;
      });

    // ── FETCH SAVED PLANS ────────────────────────────────────
    builder
      .addCase(fetchSavedPlans.pending, (state) => {
        state.loading.savedPlans = true;
        state.error.savedPlans = null;
      })
      .addCase(fetchSavedPlans.fulfilled, (state, action) => {
        state.loading.savedPlans = false;
        state.savedPlans = action.payload || [];
      })
      .addCase(fetchSavedPlans.rejected, (state, action) => {
        state.loading.savedPlans = false;
        state.error.savedPlans = action.payload;
      });

    // ── REMOVE SAVED PLAN ────────────────────────────────────
    builder
      .addCase(removeSavedPlan.pending, (state) => {
        state.loading.removeSaved = true;
        state.error.removeSaved = null;
      })
      .addCase(removeSavedPlan.fulfilled, (state, action) => {
        state.loading.removeSaved = false;
        state.savedPlans = state.savedPlans.filter(p => p.itinerary?._id !== action.payload);
      })
      .addCase(removeSavedPlan.rejected, (state, action) => {
        state.loading.removeSaved = false;
        state.error.removeSaved = action.payload;
      });
  },
});

export const { clearUserSuccess, clearUserError, resetUser } = userSlice.actions;
export default userSlice.reducer;

// SELECTORS
export const selectUserProfile = (s) => s.user.profile;
export const selectSavedPlans = (s) => s.user.savedPlans;
export const selectUserLoading = (s) => s.user.loading;
export const selectUserError = (s) => s.user.error;
export const selectUserSuccess = (s) => s.user.success;