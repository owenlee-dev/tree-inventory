import React, { useState, useEffect } from "react";
import "./header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import MapleGroveLogo from "./assets/maple-grove-permaculture.png";
import { Link } from "react-router-dom";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkChange = (newLink) => {
    setActiveLink(newLink);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img
            className="__maple-grove-permaculture"
            src={MapleGroveLogo}
            alt="Maple Grove Permaculture Logo"
          ></img>
        </Link>
      </div>
      <div className={`links-container ${isSidebarOpen ? "active" : ""}`}>
        <div className="close-icon" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} />
        </div>

        <Link
          to="/"
          className={`header-link ${activeLink === "About" ? `active` : ``}`}
        >
          <h2 onClick={() => handleLinkChange("About")}>About</h2>
        </Link>
        <Link
          to="/"
          className={`header-link ${activeLink === "Events" ? `active` : ``}`}
        >
          <h2 onClick={() => handleLinkChange("Events")}>Events</h2>
        </Link>
        <Link
          to="/store"
          className={`header-link ${activeLink === "Store" ? `active` : ``}`}
        >
          <h2 onClick={() => handleLinkChange("Store")}>Store</h2>
        </Link>
        <Link
          to="/"
          className={`header-link ${activeLink === "Contact" ? `active` : ``}`}
        >
          <h2 onClick={() => handleLinkChange("Contact")}>Contact</h2>
        </Link>
      </div>
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
    </header>
  );
}

export default Header;
