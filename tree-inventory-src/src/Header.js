import React, { useState } from "react";
import "./header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import MapleGroveLogo from "./assets/maple-grove-permaculture.png";
function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img
          className="__maple-grove-permaculture"
          src={MapleGroveLogo}
          alt="Maple Grove Permaculture Logo"
        ></img>
      </div>
      <div className={`links-container ${isSidebarOpen ? "active" : ""}`}>
        <div className="close-icon" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <h2 className="header-link">About</h2>
        <h2 className="header-link">Events</h2>
        <h2 className="header-link">Store</h2>
        <h2 className="header-link">Contact</h2>
      </div>
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
    </header>
  );
}

export default Header;
