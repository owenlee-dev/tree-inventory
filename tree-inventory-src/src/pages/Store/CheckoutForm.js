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
  sendOrderConfirmationEmail,
  updateInventory,
} from "../../components/api/api";
import { clearCart } from "../../__redux/slices/StoreSlice";
import { formatCurrency } from "../../utility/UtilityFuncs";

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
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.storeSlice.cartContents);
  const appliedCoupon = useSelector((state) => state.storeSlice.appliedCoupon);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setSubmitting(true);
    const updatedFormData = {
      ...formData,
      date: new Date().toLocaleDateString("en-CA"),
      total: formatCurrency(
        payWithCreditCard ? getTotals().total : getTotals().subtotal
      ),
      itemsPurchased: cartItems
        .map((item) => `${item.title} (${item.numInCart})`)
        .join("\n"),
      orderID: Math.floor(Math.random() * 9000000000) + 1000000000, // Random 10 digit number
    };

    try {
      if (payWithCreditCard) {
        console.log("paying with credit card");
        const result = await stripe.confirmPayment({
          elements,
          redirect: "if_required",
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        if (
          result.paymentIntent &&
          result.paymentIntent.status === "succeeded"
        ) {
          console.log("Payment successful");

          // Send confirmation email only for credit card transactions
          const response = await sendOrderConfirmationEmail(
            formData.name,
            formData.email,
            payWithCreditCard
              ? formatCurrency(getTotals().total)
              : formatCurrency(getTotals().subtotal),
            cartItems
              .map((item) => `${item.title} (${item.numInCart})`)
              .join("\n"),
            formData.pickupLocation,
            formData.orderID
          );
        } else {
          throw new Error("Payment not successful");
        }
      }

      if (!payWithCreditCard) {
        postPendingEtransfer(updatedFormData);
      }

      // common operations between etransfer and credit card (post form data, clear cart, update inventory, navigate to thankyou)
      await postFormData(updatedFormData);
      dispatch(clearCart());

      updateInventory(transformCartObject(cartItems), true);
      navigate(
        `/thank-you?payWithCreditCard=${payWithCreditCard}&orderID=${
          updatedFormData.orderID
        }&grandTotal=${getTotals().total}`
      );
      setSubmitting(false);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const transformCartObject = (itemsInCart) => {
    return itemsInCart.reduce((accumulator, item) => {
      accumulator[item.title] = item.numInCart;
      return accumulator;
    }, {});
  };

  const getTotalItemCount = () => {
    return cartItems.reduce((total, item) => total + item.numInCart, 0);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePaymentMethod = () => {
    setPayWithCreditCard(!payWithCreditCard);
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
                <h3>- {formatCurrency(getTotals().couponSavings)}</h3>
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
              <h2>
                {payWithCreditCard
                  ? formatCurrency(getTotals().total)
                  : formatCurrency(
                      getTotals().subtotal - getTotals().couponSavings
                    )}
              </h2>
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
                Send an E-Transfer of{" "}
                {formatCurrency(
                  getTotals().subtotal - getTotals().couponSavings
                )}
                $ to maplegrovepermaculture@gmail.com
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
        <button
          type="submit"
          className="submit-button button-animation"
          disabled={submitting}
        >
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
