// src/Redux/moviesThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "https://localhost:7041/api/Movie/GetAll";

export const getMovies = createAsyncThunk("movies/getMovies", async () => {
  const response = await axios.get(url);
  return response.data; // ✅ возвращаем только данные
});
