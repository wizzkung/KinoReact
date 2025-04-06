import { createSlice } from "@reduxjs/toolkit";
import { getReviews } from "./reviewsThunk";

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default reviewsSlice.reducer;
