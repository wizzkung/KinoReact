import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import MainPage from "./Components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetail from "./Components/MovieDetails";
import AdminPanel from "./Components/AdminPanel";
import ReviewsPanel from "./Components/ReviewPanel";

const App = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/admin" element={<AdminPanel />} /> {/* Новый маршрут */}
        <Route path="/ReviewPanel" element={<ReviewsPanel />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
