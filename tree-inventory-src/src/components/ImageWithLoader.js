// ImageWithLoader.js
import React, { useState } from "react";
import Loader from "./Loader";
const ImageWithLoader = ({ src, alt, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader />}
      <img
        src={src}
        alt={alt}
        {...props}
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? "block" : "none" }}
      />
    </>
  );
};

export default ImageWithLoader;
