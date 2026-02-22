import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, clearToken, saveToken } from '../services/axios.js';


export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await auth.register(formData);
      if (res.data?.accessToken) saveToken(res.data.accessToken);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await auth.login(credentials);
      if (res.data?.accessToken) saveToken(res.data.accessToken);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await auth.logout();
      clearToken();
    } catch (err) {
      clearToken();   // clear locally even if server call fails
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const res = await auth.me();
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// SLICE
const initialState = {
  user: null,
  isAuthenticated: false,
  // granular loading flags per action
  loading: {
    register: false,
    login: false,
    logout: false,
    me: false,
  },
  error: {
    register: null,
    login: null,
    logout: null,
    me: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manually clear auth (e.g. on 401 from interceptor)
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    // Clear a specific error
    clearError: (state, action) => {
      state.error[action.payload] = null;
    },
  },

  extraReducers: (builder) => {

    // ── REGISTER ─────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
        state.error.register = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
        state.user = action.payload?.user || action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.error.register = action.payload;
      });

    // ── LOGIN ────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload?.user || action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.error.login = action.payload;
      });

    // ── LOGOUT ───────────────────────────────────────────────
    builder
      .addCase(logoutUser.pending, (state) => { state.loading.logout = true; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading.logout = false;
        state.user = null;     // still clear locally
        state.isAuthenticated = false;
      });

    // ── GET ME ───────────────────────────────────────────────
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading.me = true;
        state.error.me = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading.me = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading.me = false;
        state.error.me = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;

// ─────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────
export const selectCurrentUser = (s) => s.auth.user;
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated;
export const selectAuthLoading = (s) => s.auth.loading;
export const selectAuthError = (s) => s.auth.error;