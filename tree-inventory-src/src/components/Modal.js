import React, { useState, useEffect, useRef } from "react";
import "./modal.scss"; // Import your modal CSS here
import { useDispatch } from "react-redux";
import { addToCart } from "../__redux/slices/StoreSlice";

const Modal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const dispatch = useDispatch();

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Number(event.target.value));
    setQuantity(value);
  };

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
          <p className={product.inStock ? "available" : "unavailable"}>
            {product.inStock ? "In Stock" : "Currently Unavailable"}
          </p>
          <p className="price">{product.price}$</p>
          <div>
            <p>{product.pollination ? `**${product.pollination}` : ""}</p>
            <p>{product.description}</p>
          </div>
          <div>
            <div className="quantity-input-container">
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
              <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
        <div className="modal-right">
          <img src={product.imagePath} onError={handleImageError} alt="Modal" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
