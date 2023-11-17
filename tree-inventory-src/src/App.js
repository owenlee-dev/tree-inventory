import "./App.scss";
import "./reset.css";
import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter as Router, Link } from "react-router-dom";
import Header from "./Header";
import Home from "./pages/Home/Home";
import Store from "./pages/Store/Store";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/events" element={<Store />} />
          <Route path="/contact" element={<Store />} />
          <Route path="/about" element={<Store />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
