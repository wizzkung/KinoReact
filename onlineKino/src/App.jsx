import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import MainPage from "./Components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetail from "./Components/MovieDetails";
import AdminPanel from "./Components/AdminPanel";
import ReviewsPanel from "./Components/ReviewPanel";
import { Space } from "antd";
import Diagram from "./Components/Diagram";
import UserPanel from "./Components/UserPanel";

const App = () => (
  // <div className="space-align-container">
  //   <div className="space-align-block">
  //     <Space align="center">
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
  //     </Space>
  //   </div>
  // </div>
);

export default App;
