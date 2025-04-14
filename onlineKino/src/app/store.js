import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../features/moviesSlice";
import reviewsReducer from "../features/reviewsSlice";
import adminsReducer from "../features/adminSlice";
import usersReducer from "../features/userSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    reviews: reviewsReducer,
    admins: adminsReducer,
    users: usersReducer,
    auth: authReducer,
  },
});
