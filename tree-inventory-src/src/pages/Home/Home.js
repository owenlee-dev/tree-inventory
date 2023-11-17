import React from "react";
import "./home.scss";
import HeroImage from "../../assets/grove-dome.png";
function Home() {
  return (
    <div className="home-container">
      <div className="hero-container">
        <img
          src={HeroImage}
          className="__hero-dome"
          alt="Hero image of maple grove permaculture"
        />{" "}
        <div className="hero-title-container">
          <h1 className="hero-title">Welcome to Maple Grove Permaculture</h1>
          <h3 className="hero-subtitle">
            Where the fairy's are blue and the dog is always happy to see you
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Home;
