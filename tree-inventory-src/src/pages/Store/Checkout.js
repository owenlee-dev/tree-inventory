import { useState, useEffect } from "react";
import "./checkout.scss";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "../../components/api/api";

//Thoughts on an etransfer checkout process
const Checkout = () => {
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripePromise, setStripePromise] = useState(null);
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const cartItems = useSelector((state) => state.storeSlice.cartContents);
  // const appliedCoupon = useSelector((state) => state.storeSlice.appliedCoupons);
  const { state } = useLocation(); // Assuming navigation state is used
  const appliedCoupons = state?.appliedCoupons || [];
  const { data } = useSelector((state) => ({
    data: state.storeSlice.pickupLocations,
  }));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/config`)
      .then((res) => res.json())
      .then((config) => {
        setStripePublishableKey(config.publishableKey);
      })
      .catch((error) => {
        console.error("Error fetching publishable key:", error);
      });
  }, []);

  useEffect(() => {
    if (stripePublishableKey) {
      setStripePromise(loadStripe(stripePublishableKey));
    }
  }, [stripePublishableKey]);

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
    let totals = { subtotal: 0, credit: 0, couponSavings: 0, total: 0 };

    // Calculate the subtotal
    cartItems.forEach((item) => {
      totals.subtotal += parseFloat(item.price) * item.numInCart;
    });

    // Calculate the total coupon savings
    appliedCoupons.forEach((coupon) => {
      totals.couponSavings += parseFloat(coupon.dollarsSaved);
    });

    // Calculate the tax or additional credit
    // Assuming the credit is based on the subtotal minus coupon savings
    totals.credit = (totals.subtotal - totals.couponSavings) * 0.03;

    // Calculate the grand total for credit card
    totals.total = totals.subtotal - totals.couponSavings + totals.credit;
    return totals;
  };

  const options = {
    clientSecret: clientSecret,
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
          <CheckoutForm
            getTotals={getTotals}
            pickupLocations={data}
            appliedCoupons={appliedCoupons}
          />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;
