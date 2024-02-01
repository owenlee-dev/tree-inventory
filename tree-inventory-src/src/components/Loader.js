import React from "react";
import "./loader.scss";
import { loaderImageBase64 } from "../assets/icons/BerriesBase64";
const Loader = () => {
  return (
    <div className="loader">
      <img
        src={loaderImageBase64}
        alt="https://www.flaticon.com/free-icons/berries"
        className="animated-image"
      />
      <h1 className="loading-text">Loading</h1>
    </div>
  );
};
export default Loader;
