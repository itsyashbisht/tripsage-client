import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../slices/authSlice.js';
import userReducer from '../slices/userSlice.js';
import destinationReducer from '../slices/destinationSlice.js';
import hotelReducer from '../slices/hotelSlice.js';
import restaurantReducer from '../slices/restaurantSlice.js';
import itineraryReducer from '../slices/itinerarySlice.js';
import generateReducer from '../slices/generateSlice.js';
import reviewReducer from '../slices/reviewSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    destination: destinationReducer,
    hotel: hotelReducer,
    restaurant: restaurantReducer,
    itinerary: itineraryReducer,
    generate: generateReducer,
    review: reviewReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
export const useAppDispatch = () => store.dispatch;