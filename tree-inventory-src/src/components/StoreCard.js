import React from "react";
import "./storecard.scss";

const StoreCard = (index, product) => {
  return (
    <div key={index} className="product-card">
      <img src="#" alt="Product" /> {/* Replace with actual product image */}
      <h3>Fruit Tree{index + 1}</h3> {/* Replace with actual product title */}
      <p>I like fruit trees alot to eat and not to eat</p>{" "}
      {/* Replace with actual description */}
      <button>Add to Cart</button>
    </div>
  );
};
export default StoreCard;
