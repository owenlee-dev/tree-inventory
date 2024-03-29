import React, { useState, useEffect, useRef } from "react";
import "./modal.scss"; // Import your modal CSS here
import { useDispatch } from "react-redux";
import { addToCart } from "../__redux/slices/StoreSlice";
import Tooltip from "./Tooltip";
import tooltipIcon from "../assets/icons/tooltip.png";

const Modal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const dispatch = useDispatch();

  const descriptionRef = useRef(null); // Ref for the product description container
  const [showScrollbar, setShowScrollbar] = useState(false);

  useEffect(() => {
    const descriptionContainer = descriptionRef.current;
    if (descriptionContainer) {
      const isOverflowing =
        descriptionContainer.scrollHeight >
        parseFloat(getComputedStyle(descriptionContainer).fontSize) * 15;
      setShowScrollbar(isOverflowing);
    }
  }, [product.description]);

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

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity ? parseInt(newQuantity, 10) : "");
  };
  return (
    <div className="modal-backdrop">
      <div className="modal" ref={modalRef}>
        {showOverlay && (
          <div className="overlay">Added {quantity} items to Cart</div>
        )}
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="modal-left">
          <h2>{product.title}</h2>
          <p className="price">{product.price}$</p>
          <p className={product.inStock ? "available" : "unavailable"}>
            {product.inStock ? "In Stock" : "Currently Unavailable"}
          </p>
          <div className="mobile-product-img">
            <img
              src={product.imagePath}
              onError={handleImageError}
              alt="Modal"
            />
          </div>
          <div
            className={`product-description-container ${
              showScrollbar ? "scrollable" : ""
            }`}
            ref={descriptionRef}
          >
            <p>{product.description}</p>
          </div>
          <div>
            <div className="quantity-input-container">
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={() => {
                  if (!quantity) setQuantity(1);
                }}
              />

              <button disabled={!product.inStock} onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="modal-right">
          <img src={product.imagePath} onError={handleImageError} alt="Modal" />
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
                <span className="bold">Size: </span>
                {product.size}
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
                <span className="bold">Form: </span>
                {product.form}
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
                <span className="bold">Rootstock: </span>
                {product.rootstock}
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
                <span className="bold">Pollination: </span>
                {product.pollination}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
