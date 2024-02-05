import React, { useState, useEffect, useRef } from "react";
import "./storecard.scss";
import random from "random";
import { useDispatch } from "react-redux";
import { addToCart } from "../__redux/slices/StoreSlice";

const StoreCard = ({ index, productInfo, onCardClick }) => {
  const [rotation, setRotation] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const [bottomPadding, setBottomPadding] = useState("15px");
  const [showOverlay, setShowOverlay] = useState(false);
  const titleRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (titleRef.current) {
      const height = titleRef.current.clientHeight;
      // Assuming that one line height is 24px, for example
      if (height > 24) {
        // If the height is more than 24px, then it's likely two lines
        setBottomPadding("2px"); // Adjust this value as needed
      }
    }
  }, [productInfo.title]);
  const handleMouseEnter = () => {
    // Generate a random degree between -20 and 20
    const randomDegree = random.boolean()
      ? random.int(5, 10)
      : random.int(-5, -10);
    setRotation(randomDegree);
    setScale(1.1);
  };
  //rotate the image that amount of degrees when mousing over
  const imageStyle = {
    transition: "transform 0.3s ease-in-out",
    transform: `scale(${scale}) rotate(${rotation}deg)`,
  };
  const handleMouseLeave = () => {
    // Reset rotation to 0 degrees
    setScale(1.0);
    setRotation(0);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();

    const productDataForCart = {
      title: productInfo.title,
      price: productInfo.price,
      imagePath: productInfo.imagePath,
      numInCart: 1,
      size: productInfo.size,
      form: productInfo.form,
      key: Math.random() * 11,
    };
    dispatch(addToCart(productDataForCart));
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 2000);
  };
  const handleImageError = (e) => {
    e.target.src = "./store-images/rootstock.png";
  };
  return (
    <div
      key={index}
      className="product-card"
      onClick={() => onCardClick(productInfo)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showOverlay && <div className="overlay">Added to Cart</div>}
      <div className="img-container">
        <img
          loading="lazy"
          style={imageStyle}
          src={productInfo.imagePath}
          onError={handleImageError}
          alt="Product"
        />
      </div>
      <h3 ref={titleRef}>{productInfo.title}</h3>
      <p className={productInfo.inStock ? "available" : "unavailable"}>
        {productInfo.inStock ? "In Stock" : "Unavailable"}
      </p>
      <div className="card-bot" style={{ marginTop: bottomPadding }}>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!productInfo.inStock}
        >
          Add to Cart
        </button>
        <p className="price">{productInfo.price}$</p>
      </div>
    </div>
  );
};
export default StoreCard;
