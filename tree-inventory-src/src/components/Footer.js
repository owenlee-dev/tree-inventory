import React from "react";
import "./footer.scss"; // Path to your Footer.scss file
import { Link } from "react-router-dom";
import phoneIcon from "../assets/icons/phone.png";
import emailIcon from "../assets/icons/email.png";
import FBIcon from "../assets/icons/facebook.png";
import adminIcon from "../assets/icons/admin-icon.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="left">
        <div className="contact-pair">
          <img src={phoneIcon} alt="Phone" className="phone-icon" />
          <span className="phone-number">(902) 237-9291</span>
        </div>
        <div className="contact-pair">
          <img src={emailIcon} alt="Email" className="email-icon" />
          <span className="phone-number">maplegrovepermaculture@gmail.com</span>
        </div>
      </div>
      <div className="right">
        <a
          className="contact-pair link"
          href="https://www.facebook.com/people/Maple-Grove-Permaculture/100037322333641/"
        >
          <span>Maple Grove Permaculture</span>
          <img src={FBIcon} alt="Facebook" className="fb-icon" />
        </a>
        <Link className="contact-pair link" to="/admin">
          <p>Admin</p>
          <img src={adminIcon} alt="Admin" className="admin-icon" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
