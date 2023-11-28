import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./heroMobile.scss";
import groveDome from "../../assets/images/grove-dome.png";
import mapleGrovePermaculture from "../../assets/images/maple-grove-permaculture.png";

import storeButton from "../../assets/images/store-button.png";
import eventsButton from "../../assets/images/about-button.png";
import contactButton from "../../assets/images/store-button.png";
import aboutButton from "../../assets/images/about-button.png";

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
          Where the fairy's are blue and the dog is always happy to see you
        </h3>
      </div>
      <div className="hero-mobile-body-container">
        <img className="__hero-mobile-bg" src={groveDome}></img>
        <p className="mobile-intro-paragraph">
          Ex nisi aliquip cupidatat enim. Officia reprehenderit adipisicing esse
          labore fugiat amet consectetur dolor. Dolor anim officia ullamco
          dolore irure proident do aliquip fugiat sunt. Sint aliquip et et
          excepteur officia ea ullamco mollit magna dolor cupidatat elit. Magna
          eiusmod ad irure dolore esse quis et enim mollit ut ea. Elit laboris
          non nulla excepteur ut incididunt irure laboris ut.
        </p>
      </div>
      {/* <div className="hero-buttons-container">
        <div className="hero-link-row">
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
              navigate("/events");
            }}
          >
            <img src={eventsButton} alt="Events Button" />
            <div className="text-overlay">Events</div>
          </div>
        </div>
        <div className="hero-link-row">
          <div
            className="link-button"
            onClick={() => {
              navigate("/about");
            }}
          >
            <img src={aboutButton} alt="About Button" />
            <div className="text-overlay">About Us</div>
          </div>
          <div
            className="link-button"
            onClick={() => {
              navigate("/contact");
            }}
          >
            <img src={contactButton} alt="Contact Button" />
            <div className="text-overlay">Contact</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default HeroMobile;
