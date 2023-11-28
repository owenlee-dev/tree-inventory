import React, { useState, useEffect, useRef } from "react";
import "./storecard.scss";
import Modal from "../components/Modal";
import random from "random";

const StoreCard = ({ index, productInfo, onCardClick }) => {
  const [rotation, setRotation] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const titleRef = useRef(null);
  const [bottomPadding, setBottomPadding] = useState("15px");
  const imagesBasePath = "../assets/images/store-cards/";

  const handleMouseEnter = () => {
    // Generate a random degree between -20 and 20
    const randomDegree = random.boolean()
      ? random.int(5, 10)
      : random.int(-5, -10);
    setRotation(randomDegree);
    setScale(1.1);
  };
  const imageStyle = {
    transition: "transform 0.3s ease-in-out",
    transform: `scale(${scale}) rotate(${rotation}deg)`,
  };
  const handleMouseLeave = () => {
    // Reset rotation to 0 degrees
    setScale(1.0);
    setRotation(0);
  };

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

  return (
    <div
      key={index}
      className="product-card"
      onClick={() => onCardClick(productInfo)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="img-container">
        <img style={imageStyle} src={productInfo.imagePath} alt="Product" />
      </div>
      <h3 ref={titleRef}>{productInfo.title}</h3>
      <p className={productInfo.inStock ? "available" : "unavailable"}>
        {productInfo.inStock ? "In Stock" : "Unavailable"}
      </p>
      <div className="card-bot" style={{ marginTop: bottomPadding }}>
        <button>Add to Cart</button>
        <p className="price">{productInfo.price}$</p>
      </div>
    </div>
  );
};
export default StoreCard;
