import React, { useState, useEffect } from "react";
import "./store.scss";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Outlet } from "react-router-dom";
import StoreCard from "../../components/StoreCard";
import storeHero from "../../assets/images/store-hero.png";
import shoppingCartIcon from "../../assets/icons/checkout.png";
import magnifyingGlass from "../../assets/icons/search.png";
import Modal from "../../components/Modal";
import Cart from "./Cart";
import Shopping from "./Shopping";
import Checkout from "./Checkout";

function Store() {
  const numItemsInCart = useSelector(
    (state) => state.storeSlice.numItemsInCart
  );
  // FROM GOOGLE SHEETS
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const { data, status } = useSelector((state) => ({
    data: state.storeSlice.googleSheetData,
    status: state.storeSlice.status,
  }));

  //END OF FROM GOOGLE SHEETS
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  return (
    <div className="content-container">
      <div className="store-hero-container">
        <div className="store-title-container">
          <h2>Welcome to</h2>
          <h1 className="store-title">Our Store</h1>
        </div>
        <div className="store-hero-container">
          <h3 className="store-subtitle">
            Sunt iure et earum quibusdam minus autem. Quae sequi soluta sit
            veritatis a amet. Voluptatem ipsa adipisci delectus ut consequatur
            accusamus. Aperiam aperiam quos sit sequi commodi voluptas amet id.
            Vero nobis voluptatem amet neque quidem excepturi saepe est.
          </h3>
          <img
            className="__store-hero"
            src={storeHero}
            alt="Store main photo"
          />
        </div>
      </div>
      <div className="store-content-container">
        <Routes>
          <Route index element={<Shopping storeData={data} />} />
          <Route path="review-cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="*" element={<Outlet />} />
        </Routes>
      </div>
    </div>
  );
}

export default Store;
