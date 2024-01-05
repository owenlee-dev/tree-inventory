import React from "react";
import "./footer.scss"; // Path to your Footer.scss file
import { Link } from "react-router-dom";
import phoneIcon from "../assets/icons/phone.png";
import emailIcon from "../assets/icons/email.png";
import FBIcon from "../assets/icons/facebook.png";
import IGIcon from "../assets/icons/instagram.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="left">
        <div className="contact-pair">
          <img src={phoneIcon} alt="Phone" className="phone-icon" />
          <span className="phone-number">+1 234 567 890</span>
        </div>
        <div className="contact-pair">
          <img src={emailIcon} alt="Email" className="email-icon" />
          <span className="phone-number">mapleGrove@mapleGrove.gro</span>
        </div>
      </div>
      <div className="right">
        <div className="contact-pair">
          <span className="phone-number">Maple Grove Permaculture</span>
          <img src={FBIcon} alt="Facebook" className="fb-icon" />
        </div>
        <div className="contact-pair">
          <span className="phone-number">@Maple_Grove</span>
          <img src={IGIcon} alt="Instagram" className="ig-icon" />
        </div>
      </div>
      <Link className="admin-link" to="/admin">
        <p>Admin</p>
      </Link>
    </footer>
  );
};

export default Footer;
