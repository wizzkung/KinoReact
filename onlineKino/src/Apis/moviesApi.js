import axios from "axios";
const url = "https://localhost:7041/api/Movie/GetAll";

export const fetchMovies = async () => {
  const response = await axios.get(url);
  return;
  response.data;
};
