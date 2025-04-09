import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../features/moviesSlice";
import reviewsReducer from "../features/reviewsSlice";
import adminsReducer from "../features/adminSlice";
import usersReducer from "../features/userSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    reviews: reviewsReducer,
    admins: adminsReducer,
    users: usersReducer,
  },
});
