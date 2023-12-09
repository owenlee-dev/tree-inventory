import React, { useState, useEffect, useRef } from "react";
import "./admin.scss"; // Import your modal CSS here
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../__redux/slices/StoreSlice";
import orangeFileIcon from "../../assets/images/file-icon-orange.png";
import ExcelUploader from "../../tools/ExcelUploader";
import downloadFileIcon from "../../assets/images/file-download.png";
//Thoughts on an etransfer checkout process
const Admin = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="content-container">
      <div className="admin-content">
        <h1 className="admin-title">Admin</h1>
        {isLoggedIn ? (
          <div className="admin-console">
            <h2>Current Excel Sheet:</h2>
            <div className="current-file-info">
              <img src={orangeFileIcon} alt="Upload Excel" />
              <p>
                File Name: TreeSales2022.xlsx
                <br />
                File Size: 52kb bytes
              </p>
              <img
                className="button-animation"
                src={downloadFileIcon}
                alt="Upload Excel"
              />
            </div>
            <h2>Upload a new excel sheet:</h2>
            <div className="file-upload-container">
              <ExcelUploader />
            </div>
          </div>
        ) : (
          <Login onLogin={setIsLoggedIn} />
        )}
      </div>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // TODO save these somewhere safe
    const hardcodedUsername = "this";
    const hardcodedPassword = "that";

    if (username === hardcodedUsername && password === hardcodedPassword) {
      onLogin(true);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="credential-container">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Admin;
