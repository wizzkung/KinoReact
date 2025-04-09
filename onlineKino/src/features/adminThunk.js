import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "https://localhost:7041/api/Admin/GetAll";

export const getAdmins = createAsyncThunk("admins/getAdmins", async () => {
  const response = await axios.get(url);
  return response.data; // ✅ возвращаем только данные
});
