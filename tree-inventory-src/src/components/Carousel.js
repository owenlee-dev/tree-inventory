import React, { useState, useEffect } from "react";
import "./carousel.scss"; // Make sure to create/update a CSS file with the styles provided later
const Carousel = ({ images, fixedSize, bigCarousel = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === images.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 3 seconds

    return () => clearTimeout(timer);
  }, [currentSlide, images.length]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    // Check if it's a clear swipe to the left
    if (touchStart - touchEnd > 50) {
      setCurrentSlide((currentSlide + 1) % images.length);
    }

    // Check if it's a clear swipe to the right
    if (touchStart - touchEnd < -50) {
      setCurrentSlide(
        currentSlide === 0 ? images.length - 1 : currentSlide - 1
      );
    }
  };
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
      <div
        className={`slides-container ${bigCarousel ? "big-carousel" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${
              currentSlide === index ? "visible" : "hidden"
            } ${fixedSize ? "cover" : "contain"}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
