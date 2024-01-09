import React, { useState, useEffect } from "react";
import "./about.scss";
import Carousel from "../../components/Carousel";
import carousel_1 from "../../assets/images/about_3.png";
import carousel_2 from "../../assets/images/about_2.png";
import carousel_3 from "../../assets/images/yurt.jpg";

function About() {
  const imageList = [carousel_2, carousel_1, carousel_3];
  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    // Fetch the API key from the backend
    fetch("http://localhost:8080/about")
      .then((response) => response.json())
      .then((data) => setApiKey(data.apiKey))
      .catch((error) => console.error("Error fetching API key:", error));
  }, []);

  return (
    <div className="content-container">
      <div className="about-grid">
        <div className="grid-item about-title">Our Story</div>
        <div className="grid-item big-img">
          <Carousel images={imageList} />
        </div>
        <div className="grid-item small-img"></div>
      </div>
      <section className="about-content-container">
        <h2>Welcome To Our Home</h2>
        <p>
          We are a family of 4 humans, 1 dog, 3 cats, 14 chickens, some fish,
          more worms and many, many plants! This website is the hub for
          everything we offer from our cozy pad. Check out our unique retreat
          spaces, our wide selection of available fruit trees and check in on
          upcoming events to make sure you don't miss the fun!
          <br />
        </p>
      </section>
      <section className="about-content-container">
        <h2>Perma-what?</h2>
        <p>
          At Maple Grove, we are committed to nurturing a relationship with the
          land that embodies reciprocity and respect. Our approach is influenced
          by indigenous practices that emphasize interconnectedness and
          reverence, as well as the innovative ideas emerging from the DIY,
          "back to the land," and permaculture movements.
          <br />
          <br />
          Permaculture principles guide our vision for both the land and our
          broader global aspirations. Initially an alternative agricultural
          method, permaculture has evolved into "Social Permaculture,"
          highlighting its relevance beyond farming. These principles offer a
          roadmap for societal transformation, steering us from harm towards a
          harmonious existence.
          <br />
          <br />
          At Maple Grove we use permaculture in planning our gardens and
          orchards to align with the natural flow of the land. We do pastured
          poultry and are working on a four season, geothermal greenhouse. We
          build with salvaged materials and locally milled lumber and use
          natural and experimental methods when possible. We also use
          permaculture to ground the ways we work with each other, gather with
          others and envision the world we are working towards.
        </p>
      </section>
      {/* <section className="meet-the-gang">
        <h2>Meet the Gang</h2>
        <div className="gang-container">
          <div className="gang-member">
            <div className="member-img aaron"></div>
            <h2>Aaron</h2>
            <p>
              A certified outdoorsy guy, who likes plants and trees and plants.
              He is a lover of plants and trees and when it becomes night time,
              you guessed it. more plants and trees -except at night
            </p>
          </div>
          <div className="gang-member">
            <div className="member-img morghain"></div>
            <h2>Morghain</h2>
            <p>
              A registered massage therapist, birth keeper and Reiki master who
              you bet your ass likes plants and trees! She fills her time with
              massaging plants as they grow into trees and wowee does it work.
              Look at all those plants and trees.
            </p>
          </div>
        </div>
      </section> */}
      <section className="about-content-container come-visit">
        <h2>Come Visit!</h2>
        <div className="come-visit-section">
          <p>
            We are located on the land of the Mi'kmaq near the famous tidal bore
            wave that joins the sacred Shubinacadie river with the record high
            tides of the Bay of Fundy.
            <br />
            <br /> We are a 10 minute walk from the cleansing Five Mile River
            and 20mins from the gypsum cliffs that are home to the Maitland bat
            caves.
          </p>
          <div className="come-visit-img"></div>
        </div>
      </section>
      <section className="google-maps-section">
        <div id="map-container">
          <iframe
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=47+Lawrence+Rd,East+Hants,NS`}
          ></iframe>
        </div>
        <p>
          Google maps knows our location as 47 Lawrence rd, Upper Kennetcook.
        </p>
      </section>
    </div>
  );
}

export default About;
