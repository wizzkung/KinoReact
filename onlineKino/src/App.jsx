import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import MainPage from "./Components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetail from "./Components/MovieDetails";
import AdminPanel from "./Components/AdminPanel";
import ReviewsPanel from "./Components/ReviewPanel";
import Diagram from "./Components/Diagram";
import UserPanel from "./Components/UserPanel";

const App = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/admin" element={<AdminPanel />} />{" "}
        <Route path="/ReviewPanel" element={<ReviewsPanel />} />
        <Route path="/Diagram" element={<Diagram />} />
        <Route path="/UserPanel" element={<UserPanel />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
