import React, { useState, useEffect } from "react";
import "./store.scss";
import TreeSales from "../../assets/images/maple-grove-tree-sales1.png";
import StoreCard from "../../components/StoreCard";
import storeHero from "../../assets/images/store-hero.png";
import shoppingCartIcon from "../../assets/icons/checkout.png";
import magnifyingGlass from "../../assets/icons/search.png";
import data from "../../assets/store-data.json";
import Modal from "../../components/Modal";

function Store() {
  const [storeTab, setStoreTab] = useState("Everything");
  const [activeProduct, setActiveProduct] = useState(null);
  // Data from json file
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const fruitTrees = {
    apple: data["fruit trees"]["apple trees"],
    pear: data["fruit trees"]["pear trees"],
    peach: data["fruit trees"]["peach trees"],
    sourCherry: data["fruit trees"]["sour cherry trees"],
    sweetCherry: data["fruit trees"]["sweet cherry trees"],
    apricot: data["fruit trees"]["apricot trees"],
    plum: data["fruit trees"]["plum trees"],
  };
  const nutOthers = data["nut and others"];
  const perennialBerryBushes = data["perennials, berries and bushes"];
  const rootstock = data["rootstock"];
  const supplies = data["supplies"];

  const allTrees = [
    ...Object.values(fruitTrees),
    ...nutOthers,
    ...perennialBerryBushes,
    ...rootstock,
    ...supplies,
  ].flatMap((item) => item);
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const handleTabClick = (tabName) => {
    setStoreTab(tabName);
  };
  const handleCardClick = (productInfo) => {
    setActiveProduct(productInfo); // Set the active product for the modal
  };

  const handleCloseModal = () => {
    setActiveProduct(null); // Clear the active product to close the modal
  };

  const generateCards = () => {
    let productList;
    if (storeTab === "Everything") {
      productList = allTrees;
    } else if (storeTab === "Fruit Trees") {
      productList = Object.values(fruitTrees).flat(1);
    } else if (storeTab === "Nut and Other") {
      productList = nutOthers;
    } else if (storeTab === "Perennials, Berries and Bushes") {
      productList = perennialBerryBushes;
    } else if (storeTab === "Supplies") {
      productList = supplies;
    } else if (storeTab === "Rootstock") {
      productList = rootstock;
    }
    return productList.map((item, index) => {
      // Instantiate a Product object for each item
      const product = new Product(
        item.variety,
        item.price,
        item.inventory !== null,
        item.description,
        item["img-path"],
        item.size,
        item.rootstock,
        item.pollination,
        item.form
      );

      return (
        <StoreCard
          key={index}
          productInfo={product}
          onCardClick={handleCardClick}
        />
      );
    });
  };

  useEffect(() => {
    console.log(activeProduct);
  }, [activeProduct]);

  return (
    <div className="home-container">
      <div className="store-hero-container">
        <h1 className="store-title">Welcome to the Store</h1>
        <div className="store-title-container">
          <h3 className="store-subtitle">
            Sunt iure et earum quibusdam minus autem. Quae sequi soluta sit
            veritatis a amet. Voluptatem ipsa adipisci delectus ut consequatur
            accusamus. Aperiam aperiam quos sit sequi commodi voluptas amet id.
            Vero nobis voluptatem amet neque quidem excepturi saepe est.
          </h3>
          <img
            className="__store-hero"
            src={storeHero}
            alt="Store main photo"
          />
        </div>
      </div>
      <div className="store-content-container">
        <div className="store-sidebar">
          <div className="sidebar-top">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search ..."
              ></input>
              <button className="search-icon">
                <img
                  className="__search"
                  src={magnifyingGlass}
                  alt="magnifying glass icon"
                />
              </button>
            </div>
            <div className="store-categories">
              <ul className="category-list">
                {[
                  "Everything",
                  "Fruit Trees",
                  "Nut and Other",
                  "Perennials, Berries and Bushes",
                  "Rootstock",
                  "Supplies",
                ].map((tabName) => (
                  <li
                    key={tabName}
                    className={storeTab === tabName ? "active" : ""}
                    onClick={() => handleTabClick(tabName)}
                  >
                    {tabName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sidebar-bottom">
            <div className="checkout-button">
              <h3>Checkout</h3>
              <div className="spacer"></div>
              <img
                className="__checkout"
                src={shoppingCartIcon}
                alt="shopping cart icon"
              />
            </div>
          </div>
        </div>
        <div className="store-content">
          <div className="cards-container">{generateCards()}</div>
          {activeProduct && (
            <Modal product={activeProduct} onClose={handleCloseModal} />
          )}
        </div>
      </div>
    </div>
  );
}

// class of Products to send to store card creator
class Product {
  constructor(
    title,
    price,
    inStock,
    description,
    imagePath,
    size = null,
    rootstock = null,
    pollination = null,
    form = null
  ) {
    this.title = title;
    this.price = price;
    this.inStock = inStock;
    this.description = description;
    this.imagePath = imagePath;
    this.size = size;
    this.rootstock = rootstock;
    this.pollination = pollination;
    this.form = form;
  }
}

export default Store;
