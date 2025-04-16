import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "https://localhost:7041/api/Users/GetAll";

export const getUsers = createAsyncThunk("Users/getUsers", async () => {
  const response = await axios.get(url);
  return response.data;
});
