import React, { useState, useEffect } from "react";
import "./store.scss";
import { useSelector, useDispatch } from "react-redux";

import TreeSales from "../../assets/images/maple-grove-tree-sales1.png";
import StoreCard from "../../components/StoreCard";
import storeHero from "../../assets/images/store-hero.png";
import shoppingCartIcon from "../../assets/icons/checkout.png";
import magnifyingGlass from "../../assets/icons/search.png";
import data from "../../assets/store-data.json";

import Modal from "../../components/Modal";
import Cart from "./Cart";

function Store() {
  const [storeTab, setStoreTab] = useState("Everything");
  const [activeProduct, setActiveProduct] = useState(null);
  const [sortType, setSortType] = useState("alphabetical");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [atCart, setAtCart] = useState(false);
  // const data = useSelector((state) => state.appSlice.dataFile);
  // Data from json file
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const fruitTrees = {
    "Apple Trees": data["fruit trees"]["apple trees"],
    "Pear Trees": data["fruit trees"]["pear trees"],
    "Peach Trees": data["fruit trees"]["peach trees"],
    "Sour Cherry Trees": data["fruit trees"]["sour cherry trees"],
    "Sweet Cherry Trees": data["fruit trees"]["sweet cherry trees"],
    "Apricot Trees": data["fruit trees"]["apricot trees"],
    "Plum Trees": data["fruit trees"]["plum trees"],
  };
  const nutOthers = data["nut and others"];
  const perennialBerryBushes = data["perennials, berries and bushes"];
  const rootstock = data["rootstock"];
  const supplies = data["supplies"];
  const storeValue = useSelector((state) => state.storeSlice.cartContents);
  const numItemsInCart = useSelector(
    (state) => state.storeSlice.numItemsInCart
  );
  const allTrees = [
    ...Object.values(fruitTrees),
    ...nutOthers,
    ...perennialBerryBushes,
    ...rootstock,
    ...supplies,
  ].flatMap((item) => item);
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // sort products given the list of products and [alphabetically or price]
  function sortProducts(products, sortType) {
    if (sortType === "alphabetical") {
      return products.sort((a, b) => a.variety.localeCompare(b.variety));
    } else if (sortType === "priceLowHigh") {
      return products.sort((a, b) => a.Price - b.Price);
    }

    return products;
  }

  const generateCards = (givenList = null) => {
    let productList = givenList || allTrees;

    if (storeTab === "Everything") {
      productList = allTrees;
    } else if (storeTab === "Nut and Other") {
      productList = nutOthers;
    } else if (storeTab === "Perennials, Berries and Bushes") {
      productList = perennialBerryBushes;
    } else if (storeTab === "Supplies") {
      productList = supplies;
    } else if (storeTab === "Rootstock") {
      productList = rootstock;
    }

    let searchList = allTrees;

    // Filter based on search term
    if (searchTerm) {
      searchList = searchList.filter(
        (item) =>
          item.Variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.Description &&
            item.Description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      productList = searchList;
    }

    if (showOnlyAvailable) {
      productList = removeUnavailable(productList);
    }
    //sort product list by sort parameter
    const sortedProductList = sortProducts(productList, sortType);
    return sortedProductList.map((item, index) => {
      let product = new Product(" ", " ", " ", " ", " ", " ", " ", " ", " ");
      if (item) {
        product = new Product(
          item.Variety,
          item.Price,
          item.Inventory !== null,
          item.Description,
          item["img-path"],
          item.size,
          item.rootstock,
          item.pollination,
          item.form
        );
      }

      return (
        <StoreCard
          key={index}
          productInfo={product}
          onCardClick={handleCardClick}
        />
      );
    });
  };
  //function that uses generateCards to generate fruit trees further organized in store
  const generateFruitCards = () => {
    let productList = fruitTrees;
    return Object.entries(productList).map(([key, value]) => {
      if (!value) {
        return <></>;
      }
      return (
        <div className="fruit-basket">
          <div>
            <h2 className="basket-title">{key}</h2>
          </div>
          <div className="cards-container">{generateCards(value)}</div>
        </div>
      );
    });
  };

  const removeUnavailable = (productList) => {
    return productList.filter((item) => item.inventory != null);
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };
  const handleAvailableChange = () => {
    setShowOnlyAvailable(!showOnlyAvailable);
  };
  const handleTabClick = (tabName) => {
    setStoreTab(tabName);
  };
  const handleCardClick = (productInfo) => {
    setActiveProduct(productInfo); // Set the active product for the modal
  };

  const handleCloseModal = () => {
    setActiveProduct(null); // Clear the active product to close the modal
  };
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const goToCart = () => {
    setAtCart(!atCart);
  };

  return (
    <div className="content-container">
      <div className="store-hero-container">
        <div className="store-title-container">
          <h2>Welcome to</h2>
          <h1 className="store-title">Our Store</h1>
        </div>
        <div className="store-hero-container">
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
        {atCart && <Cart toggleShopCheckout={goToCart} />}
        {!atCart && (
          <>
            <div className="store-sidebar">
              <div className="sidebar-top">
                <div className="search-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={handleSearchTermChange}
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
                <div
                  className="checkout-button button-animation"
                  onClick={goToCart}
                >
                  <h3>Your Cart</h3>
                  <div className="spacer"></div>
                  <p>{numItemsInCart}</p>
                  <img
                    className="__checkout"
                    src={shoppingCartIcon}
                    alt="shopping cart icon"
                  />
                </div>
              </div>
            </div>
            <div className="store-content">
              <div className="content-header-container">
                <div className="sort-container">
                  <label htmlFor="sort">Sort by:</label>
                  <select
                    className="sort-select"
                    name="sort"
                    onChange={handleSortChange}
                    defaultValue=""
                  >
                    <option value="alphabetical">Alphabetical</option>
                    <option value="priceLowHigh">Price low to high</option>
                  </select>
                </div>
                <div className="available-container">
                  <input
                    type="checkbox"
                    className="availability-checkbox"
                    name="availableItems"
                    onChange={handleAvailableChange}
                  />
                  <label htmlFor="availableItems">
                    Only show available items
                  </label>
                </div>
              </div>
              <div className="cards-container">
                {storeTab === "Fruit Trees" && generateFruitCards()}
                {storeTab !== "Fruit Trees" && generateCards()}
              </div>
              {activeProduct && (
                <Modal product={activeProduct} onClose={handleCloseModal} />
              )}
            </div>
          </>
        )}
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
