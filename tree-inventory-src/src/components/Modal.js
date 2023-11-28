import React, { useState } from "react";
import "./modal.scss"; // Import your modal CSS here
const Modal = ({ product, onClose, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Number(event.target.value));
    setQuantity(value);
  };
  const handleAddToCart = () => {
    // onAddToCart(quantity);
  };
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="modal-left">
          <h2>{product.title}</h2>
          <p>{product.pollination ? `**${product.pollination}` : ""}</p>
          <p>{product.description}</p>
          <p className={product.inStock ? "available" : "unavailable"}>
            {product.inStock ? "In stock" : "Currently Unavailable"}
          </p>
          <div className="quantity-input-container">
            <p>{product.price}$</p>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
            />
            <button onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
        <div className="modal-right">
          <img src={product.imagePath} alt="Modal" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
