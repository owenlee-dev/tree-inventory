import React, { useState, useEffect, useTransition } from "react";
import "./cart.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
  changeAppliedCoupon,
} from "../../__redux/slices/StoreSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  formatCurrency,
  getInventoryForVariety,
} from "../../utility/UtilityFuncs";
import MissingInventoryModal from "../../components/MissingInventoryModal";

const Cart = ({}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.storeSlice.cartContents);
  const validCoupons = useSelector((state) => state.storeSlice.validCoupons);
  const { storeData } = useSelector((state) => ({
    storeData: state.storeSlice.googleSheetData,
  }));
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponMessage, setCouponMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAppliedCoupons([]);
  }, [cartItems]);

  useEffect(() => {
    applyCoupon();
  }, [cartItems]);

  useEffect(() => {
    dispatch(changeAppliedCoupon(appliedCoupons)); // Make sure the reducer accepts an array now
  }, [appliedCoupons]);

  // avoid memory leaks or state updates on an unmounted component
  useEffect(() => {
    return () => {
      clearTimeout(displayInvalidCouponMessage);
    };
  }, []);

  useEffect(() => {
    displayInvalidCouponMessage();
  }, [couponMessage]);

  // get the totals for items in the cart
  const getTotals = () => {
    let totals = { subtotal: 0, couponSavings: 0, total: 0 };

    // Calculate the subtotal from the cart items
    cartItems.forEach((item) => {
      totals.subtotal += parseFloat(item.price) * item.numInCart;
    });

    // Calculate the total coupon savings
    appliedCoupons.forEach((coupon) => {
      totals.couponSavings += parseFloat(coupon.dollarsSaved);
    });

    // Calculate the final total: subtract coupon savings from subtotal, then add 3% of the new subtotal
    let subtotalAfterCoupons = totals.subtotal - totals.couponSavings;
    let credit = subtotalAfterCoupons * 0.03; // 3% credit based on the subtotal after coupon deductions
    totals.total = subtotalAfterCoupons + credit;

    return totals;
  };

  // check the inventory for each item in the cart - do we have what they are trying to buy
  const handleProceedToCheckout = async () => {
    let isStockAvailable = true;
    let outOfStockItems = [];

    // Step 2: Check each item in the cart against inventory
    for (const item of cartItems) {
      const inventory = getInventoryForVariety(item.title, storeData);
      if (item.numInCart > inventory) {
        isStockAvailable = false;
        const itemWithInventory = { ...item, actualInventory: inventory };
        outOfStockItems.push(itemWithInventory);
      }
    }

    // Step 3: Display modal if there are out-of-stock items
    if (!isStockAvailable) {
      showModal(outOfStockItems);
    } else {
      // Step 4: Navigate to checkout if all items are in stock
      navigateToCheckout();
    }
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
    const matchedCoupon = validCoupons.find(
      (coupon) => coupon.code === couponInput.trim()
    );
    if (matchedCoupon) {
      let cartItemTitles = cartItems.flatMap((item) =>
        Array(item.numInCart).fill(item.title)
      );
      // check if the coupon is valid
      if (isCouponValid(cartItemTitles, matchedCoupon.whenBuying)) {
        // check if the coupon is already applied
        if (
          !appliedCoupons.find((coupon) => coupon.code === matchedCoupon.code)
        ) {
          setAppliedCoupons([...appliedCoupons, matchedCoupon]); // Add to the list of applied coupons
        } else {
          setCouponMessage("Coupon already applied.");
        }
      } else {
        setCouponMessage("Coupon conditions not met.");
      }
      // If coupon is not valid then display "Coupon Invalid"
    } else {
      setCouponMessage("No coupon found");
    }
    setCouponInput(""); // Clear the input regardless of the outcome
  };

  // ~~~~~~~~~~~~~~~~~ HELPER FUNCTIONS

  const handleItemRemove = (product) => {
    dispatch(removeFromCart(product.title));
  };

  const showModal = (itemsWithInventory) => {
    setOutOfStockItems(itemsWithInventory);
    setModalVisible(true);
  };

  const navigateToCheckout = () => {
    navigate("/store/checkout", { state: { appliedCoupons } });
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
    setTimeout(() => {
      setCouponMessage("");
    }, 3000);
  };

  const removeCoupon = (couponCode) => {
    setAppliedCoupons(
      appliedCoupons.filter((coupon) => coupon.code !== couponCode)
    );
  };

  const linkClass =
    cartItems.length === 0 || getTotals().total < 0
      ? "proceed-to-checkout-btn button-animation link-disabled"
      : "proceed-to-checkout-btn button-animation";

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
                      min="0"
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
            <h2>Order Summary</h2>
            <p>{getTotalItemCount()} Items</p>
          </div>
          <div className="order-financial-info">
            <div className="total">
              <h2>Total: </h2>{" "}
              <span>
                <h2>
                  {formatCurrency(
                    getTotals().subtotal - getTotals().couponSavings
                  )}
                </h2>
              </span>
            </div>
            {appliedCoupons.map((coupon, index) => (
              <div key={index} className="conditional-coupon">
                <h2>{coupon.code}</h2>
                <span>
                  <h2>- {formatCurrency(coupon.dollarsSaved)}</h2>
                </span>
              </div>
            ))}
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
            {couponMessage !== "" && (
              <p className="invalid-coupon-message">{couponMessage}</p>
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
              <div>Proceed to Checkout</div>
            ) : (
              <div className={linkClass} onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </div>
            )}
          </div>
        </div>
      </div>
      {modalVisible && (
        <MissingInventoryModal
          items={outOfStockItems}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

export default Cart;
