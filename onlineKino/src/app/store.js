import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../features/moviesSlice";
import reviewsReducer from "../features/reviewsSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    reviews: reviewsReducer,
  },
});
