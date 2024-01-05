import React, { useState, useEffect, useRef } from "react";
import "./checkout.scss"; // Import your modal CSS here
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "../../components/api/api";

// TODO Hide this somewhere
const stripePromise = loadStripe(
  "pk_test_51OL51KGJkpFpIAbeyhoAmtJ5ZhK0knwbi35SF99mEHY5Tv17cwUY4fjKY2EOwwFNm32rG8u8Yg1X27fYJBnP2uE100gLGoMUr1"
);
//Thoughts on an etransfer checkout process
const Checkout = ({ toggleShopCheckout }) => {
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
    let totalInCents = getTotals().total * 100;
    if (totalInCents > 0) {
      createPaymentIntent(totalInCents).then((res) => {
        setClientSecret(res);
      });
    } else {
      navigate("/store/review-cart");
    }
  }, []);

  const getTotals = () => {
    let appliedCoupon = state ? state.appliedCoupon : {};
    let totals = { subtotal: 0, credit: 0, total: 0 };
    cartItems.forEach((item) => {
      totals.subtotal += parseFloat(item.price) * item.numInCart;
    });
    const couponSavings = parseFloat(appliedCoupon.dollarsSaved || 0);
    totals.subtotal = Math.max(0, totals.subtotal - couponSavings);
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

  if (!clientSecret || !stripePromise) return <div>Loading...</div>;
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
