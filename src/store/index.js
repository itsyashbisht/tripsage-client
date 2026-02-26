export { default } from "./store.js";
export { useAppDispatch } from "./store.js";

// AUTH
export {
  registerUser,
  loginUser,
  logoutUser,
  fetchMe,
  clearAuth,
  clearError as clearAuthError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "../slices/authSlice.js";

// USER
export {
  fetchUserProfile,
  updateUserDetails,
  changeUserPassword,
  fetchSavedPlans,
  removeSavedPlan,
  clearUserSuccess,
  clearUserError,
  resetUser,
  selectUserProfile,
  selectSavedPlans,
  selectUserLoading,
  selectUserError,
  selectUserSuccess,
} from "../slices/userSlice.js";

// DESTINATION
export {
  fetchAllDestinations,
  fetchDestinationBySlug,
  fetchDestinationHotels,
  fetchDestinationAttractions,
  fetchDestinationRestaurants,
  clearCurrentDestination,
  clearDestinationError,
  clearDestinationHotels,
  clearDestinationRestaurants,
  selectDestinations,
  selectDestinationsTotal,
  selectCurrentDestination,
  selectDestinationHotels,
  selectDestinationAttractions,
  selectDestinationRestaurants,
  selectDestinationLoading,
  selectDestinationError,
} from "../slices/destinationSlice.js";

// HOTEL
export {
  fetchAllHotels,
  fetchHotelById,
  clearCurrentHotel,
  clearHotelError,
  selectHotels,
  selectCurrentHotel,
  selectHotelLoading,
  selectHotelError,
} from "../slices/hotelSlice.js";

// RESTAURANT
export {
  fetchAllRestaurants,
  fetchRestaurantById,
  clearCurrentRestaurant,
  clearRestaurantError,
  selectRestaurants,
  selectCurrentRestaurant,
  selectRestaurantLoading,
  selectRestaurantError,
} from "../slices/restaurantSlice.js";

// ITINERARY
export {
  fetchAllItineraries,
  fetchItineraryById,
  fetchItineraryByToken,
  fetchUserSavedItineraries,
  deleteItinerary,
  saveItinerary,
  unsaveItinerary,
  shareItinerary,
  clearCurrentItinerary,
  clearShareData,
  clearItinerarySuccess,
  clearItineraryError,
  setCurrentItinerary,
  selectItineraries,
  selectSavedItineraries,
  selectCurrentItinerary,
  selectShareData,
  selectItineraryLoading,
  selectItineraryError,
  selectItinerarySuccess,
} from "../slices/itinerarySlice.js";

// GENERATE
export {
  generateItinerary,
  fetchPackagePrices,
  setPlannerForm,
  resetPlannerForm,
  clearGenerated,
  clearGenerateError,
  selectGeneratedItinerary,
  selectShareUrl,
  selectGenerateMeta,
  selectPackages,
  selectPlannerForm,
  selectGenerateLoading,
  selectGenerateError,
} from "../slices/generateSlice.js";

// REVIEW
export {
  fetchReviews,
  addReview,
  removeReview,
  clearReviewSuccess,
  clearReviewError,
  clearReviews,
  selectReviews,
  selectReviewLoading,
  selectReviewError,
  selectReviewSuccess,
} from "../slices/reviewSlice.js";
