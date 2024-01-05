import React, { useState, useEffect, useRef } from "react";
import "./admin.scss"; // Import your modal CSS here
import TransferTable from "../../components/TransferTable";
import { useSelector, useDispatch } from "react-redux";
import Coupon from "../../components/classes/Coupon";
import CouponModal from "../../components/CouponModal";
import { sendOrderConfirmationEmail } from "../../components/api/api";

//TODO this will need full test coverage
const Admin = () => {
  const dispatch = useDispatch();
  const [pendingEtransfers, setPendingEtransers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isCouponModalVisible, setCouponModalVisible] = useState(false);
  let coupon = new Coupon("", "");
  const [couponFormData, setCouponFormData] = useState(coupon);

  const showConfirmModal = () => setConfirmModalVisible(true);
  const hideConfirmModal = () => setConfirmModalVisible(false);
  const showCouponModal = () => setCouponModalVisible(true);
  const hideCouponModal = () => setCouponModalVisible(false);

  const { storeData } = useSelector((state) => ({
    storeData: state.storeSlice.googleSheetData,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/google-sheets/pending-etransfers"
        );
        const data = await response.json();
        setPendingEtransers(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const confirmOrders = async () => {
    // remove order from Pending Etransfers on Google Sheets
    try {
      const response = await fetch(
        "http://localhost:8080/google-sheets/confirm-orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedRows),
        }
      );
      if (response.ok) {
        selectedRows.forEach((order) => {
          sendOrderConfirmationEmail(
            order["Name"],
            order["Email"],
            order["Total Order $"],
            order["Items Purchased"],
            order["Pickup Location"],
            order["Order ID"]
          );
        });
        // Remove confirmed orders from local state
        setPendingEtransers((prevData) =>
          prevData.filter(
            (order) =>
              !selectedRows.some(
                (selectedOrder) =>
                  selectedOrder.Email === order.Email &&
                  selectedOrder["Total Order $"] === order["Total Order $"]
              )
          )
        );
        setSelectedRows([]); // Reset selected rows
        hideConfirmModal();
      }
    } catch (error) {
      console.error("Error confirming orders:", error);
    }
  };

  return (
    <div className="content-container">
      <div className="admin-content">
        <h1 className="admin-title">Admin</h1>
        {isLoggedIn ? (
          <div className="logged-in-content-container">
            <button
              className={
                selectedRows.length <= 0
                  ? "submit-button"
                  : "submit-button button-animation"
              }
              disabled={selectedRows.length <= 0}
              onClick={showConfirmModal}
            >
              Confirm Orders
            </button>
            <div className="confirmEtransfers">
              <Modal
                show={isConfirmModalVisible}
                onClose={hideConfirmModal}
                onConfirm={confirmOrders}
                title="Confirm Orders"
                message="Are you sure you want to confirm these orders?"
                actionButton="Confirm"
              />
              <TransferTable
                key={pendingEtransfers.length}
                data={pendingEtransfers}
                onSelectedRowsChange={setSelectedRows}
              />
            </div>
            <div className="coupon-container">
              <h2>Coupons</h2>
              <button className="new-coupon-btn" onClick={showCouponModal}>
                Create New Coupon
              </button>
              {isCouponModalVisible && (
                <CouponModal
                  storeData={storeData}
                  formData={couponFormData}
                  setFormData={setCouponFormData}
                  onClose={hideCouponModal}
                  show={isCouponModalVisible}
                />
              )}
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

export const Modal = ({
  show,
  onClose,
  onConfirm,
  title,
  message,
  actionButton,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="confirm-modal">
      <div className="confirm-modal-content">
        <div className="confirm-modal-header">
          <h4 className="confirm-modal-title">{title}</h4>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-primary">
            {actionButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
