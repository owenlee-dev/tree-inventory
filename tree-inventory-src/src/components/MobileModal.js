import React, { useState, useEffect, useRef } from "react";
import "./mobile-modal.scss";
import { useDispatch } from "react-redux";
import { addToCart } from "../__redux/slices/StoreSlice";
import Tooltip from "./Tooltip";
import tooltipIcon from "../assets/icons/tooltip.png";
const MobileModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, []);

  const handleAddToCart = (event) => {
    event.stopPropagation();
    const productDataForCart = {
      title: product.title,
      price: product.price,
      imagePath: product.imagePath,
      numInCart: quantity,
      size: product.size,
      form: product.form,
      key: Math.random() * 11,
    };
    dispatch(addToCart(productDataForCart));
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 2000);
  };

  useEffect(() => {
    const handleContainerClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Click occurred outside the modal, close the modal
        onClose();
      }
    };

    const container = document.querySelector(".store-content"); // Adjust the selector as needed
    container.addEventListener("click", handleContainerClick);

    // Clean up the event listener when the component unmounts
    return () => {
      container.removeEventListener("click", handleContainerClick);
    };
  }, [onClose]);

  const handleImageError = (e) => {
    e.target.src = "./store-images/rootstock.png";
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };
  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity ? parseInt(newQuantity, 10) : "");
  };
  return (
    <div className="modal-backdrop">
      <div className="modal mobile-modal-container" ref={modalRef}>
        {showOverlay && (
          <div className="overlay">Added {quantity} items to Cart</div>
        )}
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="mobile-modal-left">
          <h2>{product.title}</h2>
          <div className="mobile-modal-header">
            <img
              src={product.imagePath}
              onError={handleImageError}
              alt="Modal"
            />
            <div className="col">
              <p className="price">{product.price}$</p>
              <p className={product.inStock ? "available" : "unavailable"}>
                {product.inStock ? "In Stock" : "Currently Unavailable"}
              </p>
            </div>
          </div>

          <div className="product-description-container">
            <p>{product.description}</p>
          </div>
          <div>
            <div className="quantity-input-container">
              <button onClick={decrementQuantity} disabled={!product.inStock}>
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={() => {
                  if (!quantity) setQuantity(1);
                }}
              />
              <button onClick={incrementQuantity} disabled={!product.inStock}>
                +
              </button>
            </div>
            <div className="add-to-cart">
              <button
                className="add-to-cart"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
            <div className="product-detail-container">
              {product.size && (
                <div className="product-detail">
                  <Tooltip text="The sizes listed in cm are heights. Those in mm are the width of the trunk.">
                    <img
                      className="__tooltip"
                      alt="tooltip icon"
                      src={tooltipIcon}
                    />
                  </Tooltip>
                  <div>
                    <p>
                      <span className="bold">Size ~ </span>
                      {product.size}
                    </p>
                  </div>
                </div>
              )}

              {product.form && (
                <div className="product-detail">
                  <Tooltip text="Many of the items are being sold bare root. meaning that there is no soil or pot with the plant and that it must be planted immediately or stored appropriately.">
                    <img
                      className="__tooltip"
                      alt="tooltip icon"
                      src={tooltipIcon}
                    />{" "}
                  </Tooltip>
                  <div>
                    <p>
                      <span className="bold">Form ~ </span>
                      {product.form}
                    </p>
                  </div>
                </div>
              )}
              {product.rootstock && (
                <div className="product-detail">
                  <Tooltip text="Rootstock refers to the lower part of a grafted plant, determining the tree's growth rate, size, and resilience. It affects the fruit yield, disease resistance, and adaptability to soil and climate conditions.">
                    <img
                      className="__tooltip"
                      alt="tooltip icon"
                      src={tooltipIcon}
                    />{" "}
                  </Tooltip>
                  <div>
                    <p>
                      <span className="bold">Rootstock ~ </span>
                      {product.rootstock}
                    </p>
                  </div>
                </div>
              )}
              {product.pollination && (
                <div className="product-detail">
                  <Tooltip text="Proper pollination is essential for some plants to produce fruit. Make sure you understand the pollination requirements of your purchase.">
                    <img
                      className="__tooltip"
                      alt="tooltip icon"
                      src={tooltipIcon}
                    />
                  </Tooltip>
                  <div>
                    <p>
                      <span className="bold">Pollination ~ </span>
                      {product.pollination}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  return;
};
export default MobileModal;
