import React, { useState, useEffect, forwardRef } from "react";
import "./header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import MapleGroveLogo from "../assets/images/maple-grove-permaculture.png";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { changeTab } from "../__redux/slices/AppSlice";

const Header = forwardRef((props, ref) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.appSlice.tabSelected);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkChange = (newLink) => {
    dispatch(changeTab(newLink));
  };

  return (
    <header ref={ref} className={`header `}>
      <div className="logo-container">
        <Link to="/">
          <img
            className="__maple-grove-permaculture"
            src={MapleGroveLogo}
            alt="Maple Grove Permaculture Logo"
          ></img>
        </Link>
      </div>
      <div
        className={`links-container fade-in ${isSidebarOpen ? "active" : ""}`}
      >
        <div className="close-icon" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <Link
          to="/store"
          className={`header-link ${currentTab === "Store" ? `active` : ``}`}
        >
          <h2 onClick={() => handleLinkChange("Store")}>Store</h2>
        </Link>
        <Link
          to="/services"
          className={`header-link ${currentTab === "Services" ? `active` : ``}`}
        >
          <h2 onClick={() => handleLinkChange("Services")}>Rentals</h2>
        </Link>

        {/* <Link
          to="/events"
          className={`header-link ${currentTab === "Events" ? `active` : ``}`}
        >
          <h2 onClick={() => handleLinkChange("Events")}>Events</h2>
        </Link> */}

        <Link
          to="/about"
          className={`header-link ${currentTab === "About Us" ? `active` : ``}`}
        >
          <h2 onClick={() => handleLinkChange("About Us")}>About Us</h2>
        </Link>
      </div>
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
    </header>
  );
});

export default Header;
