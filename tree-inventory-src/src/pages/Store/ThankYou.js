import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./thankyou.scss";
import snowSledImg from "../../assets/images/snow-sled.jpg";
const ThankYou = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const payWithCreditCard = queryParams.get("payWithCreditCard") === "true";
  const orderID = queryParams.get("orderID");

  if (!payWithCreditCard) {
    return (
      <div className="etransfer thank-you-container">
        <Link to="/store" className="back-to-shop-btn button-animation">
          Return to Shop
        </Link>
        <h1>We are saving some trees for you!</h1>
        <h3 className="bold">Order Confirmation Number: {orderID}</h3>
        <img
          className="__thankyou-img"
          src={snowSledImg}
          alt="sledding tao and aaron"
        />

        <p>
          Only one more step to fruit bearing bliss!
          <br />{" "}
          <span className="bold">
            To complete the order, please send an etransfer of X$ to
            maplegrove@fakeemail.com.
          </span>{" "}
          As soon as we can confirm payment, you can expect a confirmation email
          filled with gracious thanks and tips for prep and planting!
          <br />
          <br />
          If payment isnt received within 4 days, the order will sadly be
          cancelled.
          <br />
          <br /> If you have any questions about the process or your purchase,
          you can reach Aaron over email at aaronsemail@email.com
        </p>
      </div>
    );
  } else {
    return (
      <div className="etransfer thank-you-container">
        <h1>Thank you for your purchase!</h1>
        <h3 className="bold">Order Confirmation Number: {orderID}</h3>
        <img
          className="__thankyou-img"
          src={snowSledImg}
          alt="sledding tao and aaron"
        />
        <p>
          What's next?
          <br />
          <br />
          Pickup ► Prep ► Plant ► Parent ► Prosper!
          <br />
          <br /> Right around now, you should be getting an order confirmation
          email filled with even more gracious thanks and a receipt for this
          purchase.
          <br />
          <br />
          If you have any questions about the process or your purchase, you can
          reach Aaron over email at aaronsemail@email.com
        </p>
      </div>
    );
  }
};
export default ThankYou;
