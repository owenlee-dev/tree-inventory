import React from "react";
import "./footer.scss"; // Path to your Footer.scss file
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/admin">
          <h2>Admin</h2>
        </Link>
        {/* Add more links as needed */}
      </div>
    </footer>
  );
};

export default Footer;
