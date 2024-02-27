import "./App.scss";
import "./assets/reset.css";
import React, { useEffect, useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const selectedData = useSelector((state) => ({
    data: state.storeSlice.googleSheetData,
    status: state.storeSlice.status,
  }));

  const { data, status } = useMemo(
    () => selectedData,
    [selectedData.data, selectedData.status]
  );

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
        {loading && <Loader />}
        <ConditionalHeader />
        <Routes>
          {!isMobile && (
            <Route
              index
              element={
                <PageWrapper setLoading={setLoading}>
                  <Hero />
                </PageWrapper>
              }
            />
          )}
          {isMobile && (
            <Route
              index
              element={
                <PageWrapper setLoading={setLoading}>
                  <HeroMobile />
                </PageWrapper>
              }
            />
          )}
          <Route
            path="/store/*"
            element={
              <PageWrapper setLoading={setLoading}>
                <Store />
              </PageWrapper>
            }
          />
          <Route
            path="/services"
            element={
              <PageWrapper setLoading={setLoading}>
                <Services />
              </PageWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <PageWrapper setLoading={setLoading}>
                <About />
              </PageWrapper>
            }
          />
          <Route
            path="/admin"
            element={
              <PageWrapper setLoading={setLoading}>
                <Admin />
              </PageWrapper>
            }
          />
          <Route
            path="/thank-you"
            element={
              <PageWrapper setLoading={setLoading}>
                <ThankYou />
              </PageWrapper>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

function PageWrapper({ setLoading, children }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/store")) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const handleAllImagesLoaded = () => {
      setLoading(false);
    };

    const images = document.images;
    const totalImages = images.length;
    let imagesLoaded = 0;

    const imageLoaded = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        handleAllImagesLoaded();
      }
    };

    [...images].forEach((img) => {
      if (img.complete) {
        imageLoaded();
      } else {
        img.addEventListener("load", imageLoaded);
        img.addEventListener("error", imageLoaded);
      }
    });

    if (totalImages === 0) {
      handleAllImagesLoaded();
    }

    return () => {
      [...images].forEach((img) => {
        img.removeEventListener("load", imageLoaded);
        img.removeEventListener("error", imageLoaded);
      });
    };
  }, [location.pathname, setLoading]);

  return children;
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
