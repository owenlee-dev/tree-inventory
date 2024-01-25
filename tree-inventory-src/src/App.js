import "./App.scss";
import "./assets/reset.css";
import React, { useEffect, useRef, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import About from "./pages/About/About";
import Header from "./components/Header";
import HeroMobile from "./pages/Hero/HeroMobile";
import Hero from "./pages/Hero/Hero";
import Store from "./pages/Store/Store";
import Footer from "./components/Footer";
import Admin from "./pages/Admin/Admin";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/Loader";
import {
  fetchPickupLocations,
  fetchStoreData,
  fetchValidCoupons,
} from "./__redux/slices/StoreSlice";
import { setIsMobile } from "./__redux/slices/AppSlice";
import ThankYou from "./pages/Store/ThankYou";
import Services from "./pages/Services/Services";

function App() {
  const { data, status } = useSelector((state) => ({
    data: state.storeSlice.googleSheetData,
    status: state.storeSlice.status,
  }));

  const isMobile = useSelector((state) => state.appSlice.isMobile);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStoreData());
    dispatch(fetchPickupLocations());
    dispatch(fetchValidCoupons());

    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 1000));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  if (status === "loading") {
    return <Loader />;
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
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/thank-you" element={<ThankYou />} />
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
