import React, { useState, useEffect, useRef } from "react";
import "./shopping.scss"; // Import your modal CSS here
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../__redux/slices/StoreSlice";
import StoreCard from "../../components/StoreCard";
import shoppingCartIcon from "../../assets/icons/checkout.png";
import magnifyingGlass from "../../assets/icons/search.png";
import Modal from "../../components/Modal";
import { Link } from "react-router-dom";

const Shopping = ({ storeData }) => {
  const [storeTab, setStoreTab] = useState("Everything");
  const [activeProduct, setActiveProduct] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [sortType, setSortType] = useState("alphabetical");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const numItemsInCart = useSelector(
    (state) => state.storeSlice.numItemsInCart
  );
  // FROM GOOGLE SHEETS
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // TODO This needs to change to match the subcategories
  const fruitTrees = {
    "Apple Trees": storeData["fruit trees"]["apple"].flatMap((item) => item),
    "Pear Trees": storeData["fruit trees"]["pear"].flatMap((item) => item),
    "Peach Trees": storeData["fruit trees"]["peach"].flatMap((item) => item),
    "Sour Cherry Trees": storeData["fruit trees"]["sour cherry"].flatMap(
      (item) => item
    ),
    "Sweet Cherry Trees": storeData["fruit trees"]["sweet cherry"].flatMap(
      (item) => item
    ),
    "Apricot Trees": storeData["fruit trees"]["apricot"].flatMap(
      (item) => item
    ),
    "Plum Trees": storeData["fruit trees"]["plum"].flatMap((item) => item),
  };
  const nutOthers = storeData["nut & other trees"].flatMap((item) => item);
  const perennialBerryBushes = storeData["perennials berries & bushes"].flatMap(
    (item) => item
  );
  const rootstock = storeData["rootstock"].flatMap((item) => item);
  const supplies = storeData["supplies"].flatMap((item) => item);
  const allTrees = [
    ...Object.values(fruitTrees),
    ...nutOthers,
    ...perennialBerryBushes,
    ...rootstock,
    ...supplies,
  ].flatMap((item) => item);

  // sort products given the list of products and [alphabetically or price]
  function sortProducts(products, sortType) {
    return products.sort((a, b) => {
      // First, sort by availability (inStock items first)
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;

      // Then, sort by the specified sortType
      if (sortType === "alphabetical") {
        return a.title.localeCompare(b.title);
      } else if (sortType === "priceLowHigh") {
        return a.price - b.price;
      }

      return 0;
    });
  }

  // Function to take data and make it into UI cards
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
          (item.description &&
            item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      productList = searchList;
    }

    if (showOnlyAvailable) {
      productList = removeUnavailable(productList);
    }
    // build product objects
    productList = productList.map((item, index) => {
      let imagePath = `./store-images/${item.Variety.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}.png`;

      return new Product(
        item.Variety,
        item.Price,
        item.Inventory > 0,
        item.Description,
        item.Size,
        item.Rootstock,
        item.Pollination,
        item.Form,
        imagePath
      );
    });

    //sort product list
    const sortedProductList = sortProducts(productList, sortType);

    //render cards
    return sortedProductList.map((product, index) => (
      <StoreCard
        key={index}
        productInfo={product}
        onCardClick={handleCardClick}
      />
    ));
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
    return productList.filter((item) => item.Inventory > 0);
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

  return (
    <div className="shopping-container">
      <div className="store-sidebar">
        <div className="sidebar-top">
          <div className="store-categories">
            <button
              className="dropdown-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {storeTab} &nbsp;&nbsp; {isDropdownOpen ? "▲" : "▼"}
            </button>
            {isDropdownOpen && (
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
            )}
          </div>
        </div>
        <div className="sidebar-bottom">
          <Link to="review-cart" className="checkout-button button-animation">
            <h3>Your Cart</h3>
            <img
              className="__checkout"
              src={shoppingCartIcon}
              alt="shopping cart icon"
            />
            <p className="updating-cart-items">{numItemsInCart} items</p>
          </Link>
        </div>
      </div>
      <div className="store-content">
        <div className="content-header-container">
          <div>
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
          </div>
          <div>
            <div className="available-container">
              <label htmlFor="availableItems">In Stock</label>
              <input
                type="checkbox"
                className="availability-checkbox"
                name="availableItems"
                onChange={handleAvailableChange}
              />
            </div>
            <div className="sort-container">
              <label className="sort-by" htmlFor="sort">
                Sort by:
              </label>
              <select
                className="sort-select"
                name="sort"
                onChange={handleSortChange}
                defaultValue=""
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="priceLowHigh">Price Low to High</option>
              </select>
            </div>
          </div>
        </div>
        <div className="cards-container">
          {storeTab !== "Fruit Trees" && generateCards()}
        </div>
        {storeTab === "Fruit Trees" && generateFruitCards()}
        {activeProduct && (
          <Modal product={activeProduct} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default Shopping;

// class of Products to send to store card creator
class Product {
  constructor(
    title,
    price,
    inStock,
    description,
    size = null,
    rootstock = null,
    pollination = null,
    form = null,
    imagePath = null
  ) {
    this.title = title;
    this.price = price;
    this.inStock = inStock;
    this.description = description;
    this.size = size;
    this.rootstock = rootstock;
    this.pollination = pollination;
    this.form = form;
    this.imagePath = imagePath;
  }
}
