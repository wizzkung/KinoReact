import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const reviewsUrl = "https://localhost:7041/api/Reviews/GetAll"; // пример URL для отзывов

export const getReviews = createAsyncThunk("reviews/getReviews", async () => {
  const response = await axios.get(reviewsUrl);
  console.log("RESPONSE DATA:", response.data);
  return response.data;
});
