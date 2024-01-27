import React, { useState, useEffect, useRef } from "react";
import "./store.scss";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Outlet } from "react-router-dom";
import storeHero from "../../assets/images/store-hero.png";
import Cart from "./Cart";
import Shopping from "./Shopping";
import Checkout from "./Checkout";
import ThankYou from "./ThankYou";

function Store() {
  const { numItemsInCart } = useSelector((state) => ({
    data: state.storeSlice.numItemsInCart,
    // status: state.storeSlice.validCoupons,
  }));

  let validCoupons = [
    {
      code: "SALE101",
      whenBuying: "butthole",
      dollarsSaved: "100$",
      description: "Buy any two fruit trees and get a third for free!",
      isAdvertised: true,
    },
  ];
  const isMobile = useSelector((state) => state.appSlice.isMobile);
  const guaranteeRef = useRef(null);
  const salesRef = useRef(null);
  const pickupRef = useRef(null);
  const [activeSections, setActiveSections] = useState(["sales"]);

  //Make sure that sales is open
  useEffect(() => {
    if (salesRef.current && activeSections.includes("sales")) {
      setActiveSections([...activeSections]);
    }
  }, []);

  // FROM GOOGLE SHEETS
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const { data, status } = useSelector((state) => ({
    data: state.storeSlice.googleSheetData,
    status: state.storeSlice.status,
  }));
  //END OF FROM GOOGLE SHEETS
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Function to toggle accordion sections
  const toggleSection = (section) => {
    if (activeSections.includes(section)) {
      setActiveSections(activeSections.filter((s) => s !== section));
    } else {
      setActiveSections([...activeSections, section]);
    }
  };

  const renderAdvertisedCoupons = () => {
    return validCoupons
      .filter((coupon) => coupon.isAdvertised)
      .map((validCoupon, index) => (
        <li key={index}>
          <strong>{validCoupon.code}</strong> - {validCoupon.description}
        </li>
      ));
  };

  return (
    <div className="content-container">
      <div className="store-hero-container">
        <div className="store-title-container">
          <h2>Welcome to</h2>
          <h1 className="store-title">Our Store</h1>
        </div>
        <div className="store-hero-container">
          <div className="store-text-container">
            <h3 className="store-subtitle">
              We are thrilled to assist you in planting trees and perennials
              that will nourish you and your loved ones, contributing to the
              food resiliency of our community!
            </h3>
            {isMobile && (
              <div className="inline-store-hero-img">
                <img
                  className="__store-hero"
                  src={storeHero}
                  alt="Store main photo"
                />
              </div>
            )}
            <div className="accordion">
              <div className="accordion-item">
                <span
                  className=" accordion-header"
                  onClick={() => toggleSection("sales")}
                >
                  Current Sales {activeSections.includes("sales") ? "⤴" : "⤵"}
                </span>
                <div
                  ref={salesRef}
                  className={`accordion-content ${
                    activeSections.includes("sales") ? "open" : ""
                  }`}
                  style={{
                    maxHeight:
                      activeSections.includes("sales") && salesRef.current
                        ? `${salesRef.current.scrollHeight}px`
                        : "0",
                  }}
                >
                  <p className="bold">Input these coupon codes at checkout!</p>
                  <ul>{renderAdvertisedCoupons()}</ul>
                </div>
              </div>

              {/* Our Guarantee Section */}
              <div className="accordion-item">
                <span
                  className=" accordion-header"
                  onClick={() => toggleSection("guarantee")}
                >
                  Our Guarantee{" "}
                  {activeSections.includes("guarantee") ? "⤴" : "⤵"}
                </span>
                <div
                  ref={guaranteeRef}
                  className={`accordion-content ${
                    activeSections.includes("guarantee") ? "open" : ""
                  }`}
                  style={{
                    maxHeight:
                      activeSections.includes("guarantee") &&
                      guaranteeRef.current
                        ? `${guaranteeRef.current.scrollHeight}px`
                        : "0",
                  }}
                >
                  <p>
                    If you take a picture of the purchased plant in the ground
                    with mulch (including a stake over 2ft tall) and send it to
                    us within 24hrs of receiving your order, we will guarantee
                    its survival and give you a replacement or full refund for
                    any that die within the first month.
                  </p>
                </div>
              </div>
              <div className="accordion-item">
                <span
                  className=" accordion-header"
                  onClick={() => toggleSection("pickup")}
                >
                  Spring Pickup {activeSections.includes("pickup") ? "⤴" : "⤵"}
                </span>
                <div
                  ref={pickupRef}
                  className={`accordion-content ${
                    activeSections.includes("pickup") ? "open" : ""
                  }`}
                  style={{
                    maxHeight:
                      activeSections.includes("pickup") && pickupRef.current
                        ? `${pickupRef.current.scrollHeight}px`
                        : "0",
                  }}
                >
                  {" "}
                  <p>
                    The purchase of all items in this store are for pickup in
                    April. Pickup locations range accross Nova Scotia and there
                    is lot's of flexibility regarding when and where you pickup
                    your trees!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="store-hero-right">
              <img
                className="__store-hero"
                src={storeHero}
                alt="Store main photo"
              />
              <div className="sale-banner">
                <h2>Pre-Order Tax Sale!</h2>
                <h4 className="bold">Save the tax store-wide!</h4>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="store-content-container">
        <Routes>
          <Route index element={<Shopping storeData={data} />} />
          <Route path="review-cart" element={<Cart />} />
          <Route path="thank-you" element={<ThankYou />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="*" element={<Outlet />} />
        </Routes>
      </div>
    </div>
  );
}

export default Store;
