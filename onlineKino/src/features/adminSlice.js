import { createSlice } from "@reduxjs/toolkit";
import { getAdmins } from "./adminThunk";

const adminSlice = createSlice({
  name: "admins",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdmins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAdmins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;
