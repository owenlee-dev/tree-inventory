import React, { useState, useEffect } from "react";
import servicesHero from "../../assets/images/services-hero.png";
import "./services.scss";

function Services() {
  return (
    <div className="content-container">
      <div className="services-hero">
        <div className="services-hero-left">
          <img alt="dome hero image" src={servicesHero} />
        </div>
        <div className="services-hero-right">
          <h1>Come Stay With Us!</h1>
          <p>
            Located just an hour from Halifax and a stone's throw away from the
            serene Shubenacadie River and the majestic Bay of Fundy, our
            property is an ideal starting point for endless exploration. Whether
            you fancy a leisurely walk, a ski trip, or a scenic bike ride, the
            sprawling 5-mile river trail offers a bounty of natural beauty.
          </p>
          <p className="bold">
            Available on-site professional massage and reiki services available
            with any rental
          </p>
          <p>
            Discover a unique getaway experience with our cozy accomodations
            nestled in nature.{" "}
          </p>
        </div>
      </div>
      <div className="possible-rentals">
        <div>
          <h2>Short Term Rentals</h2>
          <p>
            Available on a night by night basis, boasting "Guest Favorite"
            status on AirBNB
          </p>
          <ul>
            <li>Earth and Aircrete Dome Home</li>
            <li>Forest Yurt</li>
          </ul>
        </div>
        <div>
          <h2>Longer Stays</h2>
          <p>Available for extended retreats or work-exchange opportunities</p>
          <ul>
            <li>Rennovated School Bus</li>
            <li>Rustic Cabin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Services;
