import "./App.scss";
import "./assets/reset.css";
import React, { useEffect, useRef, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import HeroMobile from "./pages/Hero/HeroMobile";
import Hero from "./pages/Hero/Hero";
import Store from "./pages/Store/Store";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="App">
      <Router>
        <ConditionalHeader />
        <Routes>
          {!isMobile && <Route index element={<Hero />} />}
          {isMobile && <Route index element={<HeroMobile />} />}
          <Route path="/store" element={<Store />} />
          <Route path="/events" element={<Store />} />{" "}
          <Route path="/contact" element={<Store />} />
          <Route path="/about" element={<Store />} />
        </Routes>
      </Router>
    </div>
  );
}
function ConditionalHeader() {
  const location = useLocation();

  // Don't render the header on the Hero page (home page)
  if (location.pathname === "/") {
    return null;
  }
  return <Header />;
}
export default App;
