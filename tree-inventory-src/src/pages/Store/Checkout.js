import React, { useState, useEffect, useRef } from "react";
import "./checkout.scss"; // Import your modal CSS here
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "../../components/api/api";

//Thoughts on an etransfer checkout process
const Checkout = ({ toggleShopCheckout }) => {
  const stripeKey = process.env.REACT_APP_STRIPE_PROMISE;
  console.log(stripeKey);
  const stripePromise = loadStripe(stripeKey);
  const [clientSecret, setClientSecret] = useState("");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.storeSlice.cartContents);
  const { data, status } = useSelector((state) => ({
    data: state.storeSlice.pickupLocations,
    status: state.storeSlice.status,
  }));
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let totalInCents = Math.round(
      parseFloat(getTotals().total.toFixed(2)) * 100
    );
    if (totalInCents > 0) {
      createPaymentIntent(totalInCents).then((res) => {
        setClientSecret(res);
      });
    } else {
      navigate("/store/review-cart");
    }
  }, []);

  const getTotals = () => {
    let totals = { subtotal: 0, credit: 0, total: 0 };
    cartItems.forEach((item) => {
      totals.subtotal += parseFloat(item.price) * item.numInCart;
    });
    totals.credit = totals.subtotal * 0.03;
    totals.total = totals.credit + totals.subtotal;

    return totals;
  };

  const options = {
    clientSecret: clientSecret,
  };
  const getTotalItemCount = () => {
    return cartItems.reduce((total, item) => total + item.numInCart, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(value);
  };

  if (!clientSecret || !stripePromise)
    return (
      <div className="checkout-container">
        <div className="checkout-title-container">
          <h1>Checkout</h1>
          <Link
            to="/store/review-cart"
            className="back-to-cart-btn button-animation"
          >
            Return to Cart
          </Link>
          <h2 className="loading">Loading...</h2>
        </div>
      </div>
    );
  return (
    <div className="checkout-container">
      <div className="checkout-title-container">
        <h1>Checkout</h1>
        <Link
          to="/store/review-cart"
          className="back-to-cart-btn button-animation"
        >
          Return to Cart
        </Link>
      </div>
      <div className="checkout-form-container">
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm getTotals={getTotals} pickupLocations={data} />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;
