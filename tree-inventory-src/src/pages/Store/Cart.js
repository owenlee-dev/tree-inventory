import React, { useState, useEffect, useRef } from "react";
import "./cart.scss"; // Import your modal CSS here
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../__redux/slices/StoreSlice";

//Thoughts on an etransfer checkout process
const Cart = ({ toggleShopCheckout }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.storeSlice.cartContents);
  console.log(cartItems);

  const handleItemRemove = (product) => {
    console.log(product);
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

  return (
    <div className="cart-container">
      <div className="cart-title-container">
        <h1>Your garden is going to be stunning!</h1>
        <button
          className="back-to-shop-btn button-animation"
          onClick={() => {
            toggleShopCheckout();
          }}
        >
          Return to Shop
        </button>
      </div>
      <div className="cart-content-container">
        {cartItems.length === 0 && (
          <h2 className="default-msg">
            Looks like you dont have any items in your cart yet...
          </h2>
        )}
        <div className="items-in-cart-container">
          {cartItems.map((item) => (
            <div className="cart-card" key={item.key}>
              <div className="cart-image-container">
                <img src={item.imagePath} alt={item.title} />
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
                  </div>
                  <p>${item.price}</p>
                </div>
                <div className="cart-card-bot">
                  <button
                    className="remove-btn"
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
            <div>
              <h2>Subtotal:</h2>{" "}
              <span className="subtotal">
                <h2>123$</h2>
              </span>
            </div>
            <div>
              <h2>Estimated Taxes:</h2>{" "}
              <span className="est-taxes">
                <h2>123$</h2>
              </span>
            </div>
            <div className="total">
              <h2>Total: </h2>{" "}
              <span>
                <h2>123$</h2>
              </span>
            </div>
          </div>
          <button
            className="proceed-to-checkout-btn button-animation"
            onClick={() => {
              toggleShopCheckout();
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
