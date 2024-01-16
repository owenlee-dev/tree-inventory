import React, { useState, useEffect } from "react";
import "./checkoutForm.scss"; // Make sure to create a Form.css file for the CSS
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  postFormData,
  postPendingEtransfer,
  createPaymentIntent,
  sendOrderConfirmationEmail,
} from "../../components/api/api";
function CheckoutForm({ pickupLocations, getTotals }) {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    email: "",
    phone: "",
    total: "",
    pickupLocation: "",
    itemsPurchased: "",
    orderID: "",
  });
  const [payWithCreditCard, setPayWithCreditCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.storeSlice.cartContents);
  const appliedCoupon = useSelector((state) => state.storeSlice.appliedCoupon);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitting) {
      if (!payWithCreditCard) {
        // paid by etransfer
        console.log("paying with etransfer");
        postPendingEtransfer(formData);
        postFormData(formData, setIsSubmitting);
      } else {
        // paid by credit card
        console.log("paying with credit card");
        postFormData(formData, setIsSubmitting);
      }
      navigate(
        `/thank-you?payWithCreditCard=${payWithCreditCard}&orderID=${formData.orderID}`
      );
    }
  }, [isSubmitting]);

  const getGrandTotal = () => {
    let total = 0;
    if (payWithCreditCard) {
      total = getTotals().total;
    } else {
      total = getTotals().subtotal;
    }
    if (Object.keys(appliedCoupon).length > 0) {
      total = Math.max(0, total - appliedCoupon.dollarsSaved);
    }
    return total;
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePaymentMethod = () => {
    setPayWithCreditCard(!payWithCreditCard);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const today = new Date();
    const updatedFormData = {
      ...formData,
      date:
        today.getMonth() +
        1 +
        "/" +
        today.getDate() +
        "/" +
        today.getFullYear(),
      total: payWithCreditCard
        ? formatCurrency(getTotals().total)
        : formatCurrency(getTotals().subtotal),
      itemsPurchased: cartItems
        .map((item) => `${item.title} (${item.numInCart})`)
        .join("\n"),
      orderID: Math.floor(Math.random() * 9000000000) + 1000000000, //random 10 digit number
    };
    setFormData(updatedFormData);

    if (payWithCreditCard) {
      //credit card
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      if (result.error) {
        console.log(result.error.message);
      } else {
        console.log("successful payment");
        if (
          result.paymentIntent &&
          result.paymentIntent.status === "succeeded"
        ) {
          await sendOrderConfirmationEmail(
            formData.orderID,
            formData.name,
            formData.email,
            payWithCreditCard
              ? formatCurrency(getTotals().total)
              : formatCurrency(getTotals().subtotal),
            cartItems
              .map((item) => `${item.title} (${item.numInCart})`)
              .join("\n"),
            formData.pickupLocation
          );
          setIsSubmitting(true); // triggers useEffect
        }
      }
    } else {
      // etransfer
      setIsSubmitting(true); // triggers useEffect
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="contact-details">
        <h2>What's your digits?</h2>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="pickup-locations">
        <h2 id="pickup-location-title">Pickup Location:</h2>
        {pickupLocations.map((location, index) => (
          <div className="location-item" key={index}>
            <input
              type="radio"
              id={`location${index}`}
              name="pickupLocation"
              value={location.LOCATION}
              onChange={handleChange}
              required={index === 0}
            />
            <label htmlFor={`location${index}`}>
              <span className="location">{location.LOCATION}</span> <br />{" "}
              {location.DATE} - {location.TIME}
            </label>
          </div>
        ))}
      </div>
      <div className="order-summary-container">
        <div className="order-summary-title-container">
          <h2>Order Summary</h2>
          <p>{getTotalItemCount()} Items</p>
        </div>
        <div className="order-financial-info">
          <div>
            <h3>Subtotal:</h3>{" "}
            <span className="subtotal">
              <h3>{formatCurrency(getTotals().subtotal)}</h3>
            </span>
          </div>
          {/* if there's a coupon render the line */}
          {Object.keys(appliedCoupon).length > 0 && (
            <div>
              <h3>{appliedCoupon.code}:</h3>{" "}
              <span className="subtotal">
                <h3>- {formatCurrency(appliedCoupon.dollarsSaved)}</h3>
              </span>
            </div>
          )}
          <div>
            <div>
              <h3>Credit Card Fee:</h3> <p>3% charge for credit card*</p>
            </div>
            <span className="est-taxes">
              <h3>
                {payWithCreditCard
                  ? formatCurrency(getTotals().credit)
                  : formatCurrency(0)}
              </h3>
            </span>
          </div>
          <div className="total">
            <h2>Total: </h2>{" "}
            <span>
              <h2>{formatCurrency(getGrandTotal())}</h2>
            </span>
          </div>
        </div>
      </div>
      <div className="payment-section">
        <h2>Payment Details</h2>
        <button
          type="button"
          className="pay-with-btn button-animation"
          onClick={togglePaymentMethod}
        >
          {payWithCreditCard ? "Pay with E-Transfer" : "Pay With Credit Card"}
        </button>
        {payWithCreditCard && <PaymentElement required />}
        {!payWithCreditCard && (
          <div className="etransfer-payment-container">
            <p>
              To pay with Interac E-Transfer:
              <br />
              <span className="bold">
                Send an E-Transfer of {formatCurrency(getGrandTotal())}$ to
                maplegrovepermaculture@gmail.com
              </span>
            </p>
            <br />
            <p>
              Once the payment is confirmed, your order will be completed and
              you will receive a confirmation email!
            </p>
            <br />
          </div>
        )}
        <button type="submit" className="submit-button button-animation">
          {payWithCreditCard ? (
            <p>Complete Order</p>
          ) : (
            <p>Pay with E-Transfer</p>
          )}
        </button>
      </div>
    </form>
  );
}

export default CheckoutForm;
