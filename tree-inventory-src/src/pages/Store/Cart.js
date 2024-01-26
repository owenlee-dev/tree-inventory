import React, { useState, useEffect, useRef } from "react";
import "./cart.scss"; // Import your modal CSS here
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
  fetchValidCoupons,
  changeAppliedCoupon,
} from "../../__redux/slices/StoreSlice";
import { Link } from "react-router-dom";

const Cart = ({ toggleShopCheckout }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.storeSlice.cartContents);
  const validCoupons = useSelector((state) => state.storeSlice.validCoupons);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState({});
  const [showCouponInvalid, setShowCouponInvalid] = useState(false);
  useEffect(() => {
    applyCoupon();
  }, [cartItems]);

  useEffect(() => {
    dispatch(changeAppliedCoupon(appliedCoupon));
  }, [appliedCoupon]);

  // avoid memory leaks or state updates on an unmounted component
  useEffect(() => {
    return () => {
      clearTimeout(displayInvalidCouponMessage);
    };
  }, []);

  // get the totals for items in the cart
  const getTotals = () => {
    let totals = { subtotal: 0, taxes: 0, total: 0 };
    cartItems.forEach((item) => {
      for (let i = 0; i < item.numInCart; i++) {
        totals.subtotal += parseFloat(item.price);
      }
    });
    totals.credit = totals.subtotal * 0.03;
    totals.total = totals.credit + totals.subtotal;

    return totals;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(value);
  };
  const totalAfterCoupon =
    getTotals().total - parseFloat(appliedCoupon.dollarsSaved);
  const linkClass =
    cartItems.length <= 0 || totalAfterCoupon <= 0
      ? "proceed-to-checkout-btn button-animation link-disabled"
      : "proceed-to-checkout-btn button-animation";

  const handleItemRemove = (product) => {
    dispatch(removeFromCart(product.title));
  };

  const handleQuantityChange = (title, value) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      dispatch(updateCartItemQuantity({ title, newQuantity }));
    }
  };

  const getTotalItemCount = () => {
    return cartItems.reduce((total, item) => total + item.numInCart, 0);
  };
  const handleImageError = (e) => {
    e.target.src = "../store-images/rootstock.png";
  };

  const handleCouponChange = (e) => {
    setCouponInput(e.target.value);
  };

  const displayInvalidCouponMessage = () => {
    setShowCouponInvalid(true);
    setTimeout(() => {
      setShowCouponInvalid(false);
    }, 3000);
  };

  // Iterates over each condition in whenBuying, when a condition is met then the item is removed from the cart
  const isCouponValid = (cartItemTitles, whenBuying) => {
    let remainingCartTitles = [...cartItemTitles];

    return whenBuying.every((conditionGroup) => {
      const conditionMet = conditionGroup.some((item) => {
        const index = remainingCartTitles.indexOf(item);
        if (index > -1) {
          // Remove the used item from the remaining cart titles
          remainingCartTitles.splice(index, 1);
          return true;
        }
        return false;
      });
      return conditionMet;
    });
  };

  const applyCoupon = () => {
    // first check if coupon is valid
    const matchedCoupon = validCoupons.find(
      (coupon) => coupon.code === couponInput
    );
    if (matchedCoupon) {
      // second check if there is conditional application for the coupon (ie buy x get y)
      if (matchedCoupon.whenBuying.length > 0) {
        let cartItemTitles = cartItems.flatMap((item) =>
          Array(item.numInCart).fill(item.title)
        );
        // third check if the right items are in the cart
        if (isCouponValid(cartItemTitles, matchedCoupon.whenBuying)) {
          console.log("Coupon applied, save: ", matchedCoupon.dollarsSaved);
          setAppliedCoupon(matchedCoupon);
        } else {
          setAppliedCoupon({}); //they removed something from their cart
        }
      } else {
        console.log("Coupon applied, save: ", matchedCoupon.dollarsSaved);
        setAppliedCoupon(matchedCoupon);
      }
    } else {
      // TODO set a coupon-not-valid message in ui
      console.log("Invalid coupon code");
      displayInvalidCouponMessage();
      setCouponInput("");
      setAppliedCoupon({});
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-title-container">
        <h1>Your garden is going to be stunning!</h1>
        <Link to="/store" className="back-to-shop-btn button-animation">
          Return to Shop
        </Link>
      </div>
      <div className="cart-content-container">
        <div className="items-in-cart-container">
          {cartItems.length === 0 && (
            <h2 className="default-msg">
              Looks like you dont have any items in your cart yet...
            </h2>
          )}
          {cartItems.map((item) => (
            <div className="cart-card" key={item.key}>
              <div className="cart-image-container">
                <img
                  src={"." + item.imagePath}
                  alt={item.title}
                  onError={handleImageError}
                />
              </div>
              <div className="cart-info-container">
                <div className="cart-card-top">
                  <div className="cart-item-title">
                    <p>{item.title}</p>
                    {item.size && <h3 className="size">Size: {item.size}</h3>}
                  </div>
                  <div className="num-items-container">
                    <input
                      type="number"
                      value={item.numInCart}
                      onChange={(e) =>
                        handleQuantityChange(item.title, e.target.value)
                      }
                      min="1"
                    />
                    <p>${item.price}</p>
                  </div>
                </div>
                <div className="cart-card-bot">
                  <button
                    className="remove-btn button-animation"
                    onClick={() => handleItemRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary-container">
          <div className="order-summary-title-container">
            <h1>Order Summary</h1>
            <p>{getTotalItemCount()} Items</p>
          </div>
          <div className="order-financial-info">
            <div className="total">
              <h2>Total: </h2>{" "}
              <span>
                <h2>{formatCurrency(getTotals().subtotal)}</h2>
              </span>
            </div>
            {!(
              (
                Object.keys(appliedCoupon).length === 0 &&
                appliedCoupon.constructor === Object
              ) // appliedCoupon is not empty empty
            ) && (
              <div className="conditional-coupon">
                <h2>{appliedCoupon.code}</h2>
                <span>
                  <h2>- {formatCurrency(appliedCoupon.dollarsSaved)}</h2>
                </span>
              </div>
            )}
            <p>**Credit card payments are subject to a 3% surcharge</p>
          </div>
          <div className="coupon-container">
            <p>Coupon:</p>
            <input
              id="coupon-input"
              name="Coupon"
              value={couponInput}
              onChange={handleCouponChange}
              required
            />
            {showCouponInvalid && (
              <p className="invalid-coupon-message">Coupon invalid</p>
            )}
            <button
              className="apply-coupon-btn button-animation"
              onClick={applyCoupon}
            >
              Apply
            </button>
          </div>

          <div className="spacer"></div>
          <div>
            {cartItems.length <= 0 ? (
              <div className={linkClass}>Proceed to Checkout</div>
            ) : (
              <Link
                to="/store/checkout"
                state={{ appliedCoupon: appliedCoupon }}
                className={linkClass}
              >
                Proceed to Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
