import React, { useState, useEffect, useRef } from "react";
import "./checkout.scss"; // Import your modal CSS here
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../__redux/slices/StoreSlice";

//Thoughts on an etransfer checkout process
const Checkout = ({ toggleShopCheckout }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.storeSlice.cartContents);

  const getTotalItemCount = () => {
    return cartItems.reduce((total, item) => total + item.numInCart, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(value);
  };

  return <div className="checkout-container">CHECKOUT</div>;
};

export default Checkout;
