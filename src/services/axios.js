import axios from 'axios';
import API, { buildUrl } from '../constants/apiEndpoints.js';

// ── Axios instance
const REQUEST = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach JWT token
REQUEST.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — flatten data + handle errors ──────────────────────
REQUEST.interceptors.response.use(
  (response) => {
    // Backend wraps payloads as { success, data, message }
    // Flatten so callers get response.data = actual resource directly
    if (response.data?.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);

    // Auto-logout on 401
    if (error.response?.status === 401) {
      console.warn('❌ Unauthorized — logging out');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) console.error('❌ Forbidden access');
    if (error.response?.status === 500) console.error('❌ Internal server error');

    return Promise.reject(error);
  },
);

// ── Token helpers
export const saveToken = (token) => localStorage.setItem('accessToken', token);
export const clearToken = () => localStorage.removeItem('accessToken');
export const getToken = () => localStorage.getItem('accessToken');

// AUTH
export const auth = {
  register: (data) => REQUEST.post(API.AUTH.REGISTER, data),
  login: (data) => REQUEST.post(API.AUTH.LOGIN, data),
  logout: () => REQUEST.post(API.AUTH.LOGOUT),
  me: () => REQUEST.get(API.AUTH.ME),
};

// USER
export const users = {
  getMe: () => REQUEST.get(API.USER.GET_ME),
  updateDetails: (data) => REQUEST.patch(API.USER.UPDATE_DETAILS, data),
  changePassword: (data) => REQUEST.patch(API.USER.CHANGE_PASSWORD, data),
  getSaved: () => REQUEST.get(API.USER.GET_SAVED),
  removeSaved: (itineraryId) => REQUEST.delete(buildUrl(API.USER.REMOVE_SAVED, { itineraryId })),
};

// DESTINATIONS
export const destinations = {
  getAll: (params = {}) => REQUEST.get(API.DESTINATION.GET_ALL, { params }),
  getBySlug: (slug) => REQUEST.get(buildUrl(API.DESTINATION.GET_BY_SLUG, { slug })),
  getHotels: (slug, params = {}) => REQUEST.get(buildUrl(API.DESTINATION.GET_HOTELS, { slug }), { params }),
  getAttractions: (slug) => REQUEST.get(buildUrl(API.DESTINATION.GET_ATTRACTIONS, { slug })),
  getRestaurants: (slug, params = {}) => REQUEST.get(buildUrl(API.DESTINATION.GET_RESTAURANTS, { slug }), { params }),
};

// HOTELS
export const hotels = {
  getAll: (params = {}) => REQUEST.get(API.HOTEL.GET_ALL, { params }),
  getById: (hotelId) => REQUEST.get(buildUrl(API.HOTEL.GET_BY_ID, { hotelId })),
};

// RESTAURANTS
// GET /api/v1/restaurants              — ?destinationId=&isVeg=&priceRange=
// GET /api/v1/restaurants/:restaurantId

export const restaurants = {
  getAll: (params = {}) => REQUEST.get(API.RESTAURANT.GET_ALL, { params }),
  getById: (restaurantId) => REQUEST.get(buildUrl(API.RESTAURANT.GET_BY_ID, { restaurantId })),
};

// ITINERARIES
// GET    /api/v1/itineraries                       — user's own list
// GET    /api/v1/itineraries/user/saved
// GET    /api/v1/itineraries/shared/:shareToken    — public share link
// GET    /api/v1/itineraries/:itineraryId
// DELETE /api/v1/itineraries/:itineraryId
// POST   /api/v1/itineraries/:itineraryId/save     — { note }
// DELETE /api/v1/itineraries/:itineraryId/save
// POST   /api/v1/itineraries/:itineraryId/share    — { platform }

export const itineraries = {
  getAll: () => REQUEST.get(API.ITINERARY.GET_ALL),
  getUserSaved: () => REQUEST.get(API.ITINERARY.GET_USER_SAVED),
  getByToken: (shareToken) => REQUEST.get(buildUrl(API.ITINERARY.GET_BY_TOKEN, { shareToken })),
  getById: (itineraryId) => REQUEST.get(buildUrl(API.ITINERARY.GET_BY_ID, { itineraryId })),
  delete: (itineraryId) => REQUEST.delete(buildUrl(API.ITINERARY.DELETE, { itineraryId })),
  save: (itineraryId, note = '') => REQUEST.post(buildUrl(API.ITINERARY.SAVE, { itineraryId }), { note }),
  unsave: (itineraryId) => REQUEST.delete(buildUrl(API.ITINERARY.UNSAVE, { itineraryId })),
  share: (itineraryId, platform) => REQUEST.post(buildUrl(API.ITINERARY.SHARE, { itineraryId }), { platform }),
};

// GENERATE  (Claude AI)
// POST /api/v1/generate           — { destination, originCity, days, ... }
// GET  /api/v1/generate/packages  — ?days=&adults=&children=&dailyBudget=

export const generate = {
  itinerary: (data) => REQUEST.post(API.GENERATE.ITINERARY, data),
  packages: (params = {}) => REQUEST.get(API.GENERATE.PACKAGES, { params }),
};

// REVIEWS
// GET    /api/v1/reviews        — ?destinationId=
// POST   /api/v1/reviews        — { destinationId, rating, comment, tripDate }
// DELETE /api/v1/reviews/:reviewId

export const reviews = {
  getAll: (destinationId) => REQUEST.get(API.REVIEW.GET_ALL, { params: { destinationId } }),
  add: (data) => REQUEST.post(API.REVIEW.ADD, data),
  remove: (reviewId) => REQUEST.delete(buildUrl(API.REVIEW.DELETE, { reviewId })),
};

// ── Default export — raw axios instance for one-off calls ─────────────────────
export default REQUEST;