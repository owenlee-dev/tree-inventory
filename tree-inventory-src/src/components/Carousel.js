import React, { useState, useEffect } from "react";
import "./carousel.scss"; // Make sure to create/update a CSS file with the styles provided later
const Carousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === images.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 3 seconds

    return () => clearTimeout(timer);
  }, [currentSlide, images.length]);

  return (
    <div className="carousel">
      <div className="caret-container">
        {images.map((_, index) => (
          <div
            key={index}
            className={`caret ${currentSlide === index ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      <div className="slides-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${currentSlide === index ? "visible" : "hidden"}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
