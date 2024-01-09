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
  const numItemsInCart = useSelector(
    (state) => state.storeSlice.numItemsInCart
  );
  const isMobile = useSelector((state) => state.appSlice.isMobile);
  const guaranteeRef = useRef(null);
  const sizeFormRef = useRef(null);
  const pollinationRef = useRef(null);
  const inventoryRef = useRef(null);
  const [activeSections, setActiveSections] = useState(["guarantee"]);

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
              food resiliency of our communities!
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
                    with mulch (and a stake if over 2ft tall) and send it to us
                    within 24hrs of receiving it, we will guarantee its survival
                    and give you a replacement or full refund for any that die
                    within the first month.
                  </p>
                </div>
              </div>
              <div className="accordion-item">
                <span
                  className=" accordion-header"
                  onClick={() => toggleSection("inventory")}
                >
                  Inventory {activeSections.includes("inventory") ? "⤴" : "⤵"}
                </span>
                <div
                  ref={inventoryRef}
                  className={`accordion-content ${
                    activeSections.includes("inventory") ? "open" : ""
                  }`}
                  style={{
                    maxHeight:
                      activeSections.includes("inventory") &&
                      inventoryRef.current
                        ? `${inventoryRef.current.scrollHeight}px`
                        : "0",
                  }}
                >
                  {" "}
                  <p>
                    We hope for all our plants to survive the winter, but
                    sometimes nature has other plans. That's why our full
                    inventory is only confirmed in spring. If an item you desire
                    is sold out, just add it to your waitlist at checkout, and
                    we'll do our utmost to fulfill your order. In the rare event
                    we can't provide a plant you've purchased, we'll promptly
                    issue a refund with our apologies.
                  </p>
                </div>
              </div>

              <div className="accordion-item">
                <span
                  className=" accordion-header"
                  onClick={() => toggleSection("sizeForm")}
                >
                  Size and Form{" "}
                  {activeSections.includes("sizeForm") ? "⤴" : "⤵"}
                </span>
                <div
                  ref={sizeFormRef}
                  className={`accordion-content ${
                    activeSections.includes("sizeForm") ? "open" : ""
                  }`}
                  style={{
                    maxHeight:
                      activeSections.includes("sizeForm") && sizeFormRef.current
                        ? `${sizeFormRef.current.scrollHeight}px`
                        : "0",
                  }}
                >
                  <p>
                    Many of the items are being sold bare root. meaning that
                    there is no soil or pot with the plant and that it must be
                    planted immediately or stored appropriately.
                  </p>
                </div>
              </div>

              {/* Pollination Section */}
              <div className="accordion-item">
                <span
                  className=" accordion-header"
                  onClick={() => toggleSection("pollination")}
                >
                  Pollination{" "}
                  {activeSections.includes("pollination") ? "⤴" : "⤵"}
                </span>
                <div
                  ref={pollinationRef}
                  className={`accordion-content ${
                    activeSections.includes("pollination") ? "open" : ""
                  }`}
                  style={{
                    maxHeight:
                      activeSections.includes("pollination") &&
                      pollinationRef.current
                        ? `${pollinationRef.current.scrollHeight}px`
                        : "0",
                  }}
                >
                  {" "}
                  <p>
                    Understanding pollination requirements is so important for
                    tree growth! Make sure you understand the pollination
                    requirements of your purchase.
                  </p>
                </div>
              </div>
            </div>

            <p>Tax is included in all our prices</p>
          </div>

          {!isMobile && (
            <img
              className="__store-hero"
              src={storeHero}
              alt="Store main photo"
            />
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
