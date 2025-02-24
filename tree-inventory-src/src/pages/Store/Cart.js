import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  changeAppliedCoupon,
  removeFromCart,
  updateCartItemQuantity,
} from "../../__redux/slices/StoreSlice";
import MissingInventoryModal from "../../components/MissingInventoryModal";
import {
  formatCurrency,
  getInventoryForVariety,
} from "../../utility/UtilityFuncs";
import "./cart.scss";

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
    let isSubscribed = true;

    const updateAppliedCoupons = async () => {
      try {
        if (isSubscribed) {
          await dispatch(changeAppliedCoupon(appliedCoupons));
        }
      } catch (error) {
        console.error("Error updating applied coupons:", error);
      }
    };

    updateAppliedCoupons();

    return () => {
      isSubscribed = false;
    };
  }, [appliedCoupons, dispatch]);

  // avoid memory leaks or state updates on an unmounted component
  useEffect(() => {
    let isSubscribed = true;

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    let messageTimer;
    if (couponMessage) {
      messageTimer = setTimeout(() => {
        setCouponMessage("");
      }, 3000);
    }
    return () => {
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
    };
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

    for (const item of cartItems) {
      const inventory = getInventoryForVariety(item.title, storeData);

      if (inventory === null || inventory === undefined) {
        console.warn(`Inventory not found for variety "${item.title}"`);
        isStockAvailable = false;
        const itemWithInventory = { ...item, actualInventory: 0 };
        outOfStockItems.push(itemWithInventory);
        continue;
      }

      if (item.numInCart > inventory) {
        isStockAvailable = false;
        const itemWithInventory = { ...item, actualInventory: inventory };
        outOfStockItems.push(itemWithInventory);
      }
    }

    if (!isStockAvailable) {
      showModal(outOfStockItems);
    } else {
      navigateToCheckout();
    }
  };

  // Iterates over each condition in whenBuying, when a condition is met then the item is removed from the cart
  const isCouponValid = (cartItemTitles, whenBuying) => {
    let remainingCartTitles = cartItemTitles.map((title) =>
      title.toLowerCase().trim()
    );

    return whenBuying.every((conditionGroup) => {
      return conditionGroup.some((item) => {
        const normalizedItem = item.toLowerCase().trim();
        const index = remainingCartTitles.indexOf(normalizedItem);
        if (index > -1) {
          remainingCartTitles.splice(index, 1);
          return true;
        }
        return false;
      });
    });
  };

  const applyCoupon = async () => {
    try {
      const matchedCoupon = validCoupons.find(
        (coupon) =>
          coupon.code.toLowerCase() === couponInput.trim().toLowerCase()
      );

      if (matchedCoupon) {
        let cartItemTitles = cartItems.flatMap((item) =>
          Array(item.numInCart).fill(item.title.toLowerCase().trim())
        );

        if (isCouponValid(cartItemTitles, matchedCoupon.whenBuying)) {
          if (
            !appliedCoupons.find(
              (coupon) =>
                coupon.code.toLowerCase() === matchedCoupon.code.toLowerCase()
            )
          ) {
            // Wrap state updates in Promise.resolve to handle them synchronously
            await Promise.resolve(
              setAppliedCoupons([...appliedCoupons, matchedCoupon])
            );
          } else {
            setCouponMessage("Coupon already applied.");
          }
        } else {
          setCouponMessage("Coupon conditions not met.");
        }
      } else {
        setCouponMessage("No coupon found");
      }
      setCouponInput("");
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponMessage("Error applying coupon");
    }
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
              <div>Cart is empty</div>
            ) : (
              <div
                className="proceed-to-checkout-btn button-animation"
                onClick={handleProceedToCheckout}
              >
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
