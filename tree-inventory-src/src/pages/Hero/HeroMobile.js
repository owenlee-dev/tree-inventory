import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./heroMobile.scss";
import groveDome from "../../assets/images/grove-dome.png";
import mapleGrovePermaculture from "../../assets/images/maple-grove-permaculture.png";

import storeButton from "../../assets/images/store-button.jpg";
import aboutButton from "../../assets/images/about-button.jpg";

function HeroMobile() {
  const [divHeight, setDivHeight] = useState("80vh"); // Default height
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 1000) {
        setDivHeight("50vh"); // Minimum height for small screens
      } else {
        // Calculate the proportional height between 50vh and 80vh
        const height = 50 + 30 * ((screenWidth - 1000) / 600);
        setDivHeight(`${Math.min(height, 80)}vh`); // Ensure max height is 80vh
      }
    };

    // Set the initial height
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="hero-mobile-container">
      <div className="hero-mobile-title-container">
        <img className="__mobile-logo" src={mapleGrovePermaculture}></img>
        <h3 className="hero-mobile-subtitle">
          Where the vines are full and the dog is always happy to see you
        </h3>
      </div>
      <div className="hero-mobile-body-container">
        <img className="__hero-mobile-bg" src={groveDome}></img>
        <p className="mobile-intro-paragraph">
          Welcome! Our tree and perennial sales for spring pick-up are now in
          full swing. With limited inventory, we encourage you to visit our
          store soon to prepare for the spring 2024 season. <br />
          <br /> We are also thrilled to announce the completion of our Earth &
          Aircrete Dome Home, available now along with several other unique
          retreat spaces.
        </p>
      </div>
      <div className="hero-buttons-container">
        <div className="hero-mobile-link-row">
          <div
            className="link-button"
            onClick={() => {
              navigate("/store");
            }}
          >
            <img src={storeButton} alt="Store Button" />
            <div className="text-overlay">Store</div>
          </div>
          <div
            className="link-button"
            onClick={() => {
              navigate("/about");
            }}
          >
            <img src={aboutButton} alt="About Button" />
            <div className="text-overlay">About Us</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroMobile;
