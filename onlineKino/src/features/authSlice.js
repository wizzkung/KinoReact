import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  role: null,
  login: null, // <-- добавили
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.login = action.payload.login; // <-- сохраняем login
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.login = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectCurrentRole = (state) => state.auth?.role;
export const selectCurrentLogin = (state) => state.auth?.login; // <-- селектор
export default authSlice.reducer;
