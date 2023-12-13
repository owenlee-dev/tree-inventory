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
import Footer from "./components/Footer";
import Admin from "./pages/Admin/Admin";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreData } from "./__redux/slices/StoreSlice";

function App() {
  const { data, status } = useSelector((state) => ({
    data: state.storeSlice.googleSheetData,
    status: state.storeSlice.status,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStoreData());
  }, [dispatch]);

  // useEffect(() => {
  //   console.log(status);
  // }, [status]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (status === "loading") {
    return <h1>LOADING</h1>;
  }

  return (
    <div className="App">
      <Router>
        <ConditionalHeader />
        <Routes>
          {!isMobile && <Route index element={<Hero />} />}
          {isMobile && <Route index element={<HeroMobile />} />}
          <Route path="/store/*" element={<Store />} />
          <Route path="/events" element={<Store />} />{" "}
          <Route path="/services" element={<Store />} />
          <Route path="/about" element={<Store />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
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
