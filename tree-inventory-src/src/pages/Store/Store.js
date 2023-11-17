import React from "react";
import "./store.scss";
import TreeSales from "../../assets/maple-grove-tree-sales1.png";
import StoreCard from "../../components/StoreCard";

function Store() {
  const products = Array.from({ length: 10 });
  return (
    <div className="home-container">
      <div className="store-hero-container">
        <img src={TreeSales} className="__tree-sales" alt="Product" />{" "}
        <div className="title-container">
          <h1 className="title">Buy Our Stuff</h1>
          <h3 className="subtitle">
            Sint amet ad sunt esse fugiat dolore. Elit nisi cupidatat fugiat
            consectetur nostrud laborum adipisicing enim. Elit deserunt commodo
            labore sunt
          </h3>
        </div>
      </div>
      <div className="cards-container">
        {products.map((product, index) => (
          <StoreCard index product />
        ))}
      </div>
    </div>
  );
}

export default Store;
