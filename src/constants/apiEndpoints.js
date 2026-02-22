const API = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
  },
  USER: {
    GET_ME: '/api/v1/users/getProfile',
    UPDATE_DETAILS: '/api/v1/users/me',
    CHANGE_PASSWORD: '/api/v1/users/me/password',
    GET_SAVED: '/api/v1/users/me/saved',
    REMOVE_SAVED: '/api/v1/users/me/saved/:itineraryId',
  },
  DESTINATION: {
    GET_ALL: '/api/v1/destinations',
    GET_BY_SLUG: '/api/v1/destinations/:slug',
    GET_HOTELS: '/api/v1/destinations/:slug/hotels',
    GET_ATTRACTIONS: '/api/v1/destinations/:slug/attractions',
    GET_RESTAURANTS: '/api/v1/destinations/:slug/restaurants',
  },
  HOTEL: {
    GET_ALL: '/api/v1/hotels',
    GET_BY_ID: '/api/v1/hotels/:hotelId',
  },
  RESTAURANT: {
    GET_ALL: '/api/v1/restaurants',
    GET_BY_ID: '/api/v1/restaurants/:restaurantId',
  },
  ITINERARY: {
    GET_ALL: '/api/v1/itineraries',
    GET_BY_ID: '/api/v1/itineraries/:itineraryId',
    GET_BY_TOKEN: '/api/v1/itineraries/shared/:shareToken',
    GET_USER_SAVED: '/api/v1/itineraries/user/saved',
    DELETE: '/api/v1/itineraries/:itineraryId',
    SAVE: '/api/v1/itineraries/:itineraryId/save',
    UNSAVE: '/api/v1/itineraries/:itineraryId/save',
    SHARE: '/api/v1/itineraries/:itineraryId/share',
  },
  GENERATE: {
    ITINERARY: '/api/v1/generate',
    PACKAGES: '/api/v1/generate/packages',
  },
  REVIEW: {
    GET_ALL: '/api/v1/reviews',
    ADD: '/api/v1/reviews',
    DELETE: '/api/v1/reviews/:reviewId',
  },
};

export default API;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — replaces :param placeholders in an endpoint string
//
// Usage:
//   import API, { buildUrl } from '@/constants/apiEndpoints';
//   const url = buildUrl(API.DESTINATION.GET_BY_SLUG, { slug: 'jaipur' });
//   // → "/api/v1/destinations/jaipur"
// ─────────────────────────────────────────────────────────────────────────────
export function buildUrl (endpoint, params = {}) {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });
  return url;
}