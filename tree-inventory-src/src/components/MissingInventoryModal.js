import React, { useState } from "react";
import "./missing-inventory-modal.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemQuantity } from "../__redux/slices/StoreSlice";
function MissingInventoryModal({ items, onClose }) {
  const dispatch = useDispatch();

  const handleBuyRest = (item) => {
    dispatch(
      updateCartItemQuantity({
        title: item.title,
        newQuantity: item.actualInventory,
      })
    );
    setPurchasedItems((prev) => ({ ...prev, [item.title]: true }));
  };

  // State to keep track of which items have been purchased
  const [purchasedItems, setPurchasedItems] = useState({});

  return (
    <div className="modal-backdrop">
      <div className="MissingInventoryModal">
        <h2>
          Whoops! Looks like we don't have that much inventory available right
          now.
        </h2>
        <ul>
          {items.map((item) => (
            <li>
              <InventoryCard
                item={item}
                onBuyRest={() => handleBuyRest(item)}
                purchased={purchasedItems[item.title]}
              />
            </li>
          ))}
        </ul>
        <p>
          If we were unable to fill your order, we encourage you to reach out to
          maplegrovepermaculture.com and let us know. Maybe we can get you what
          you need!
        </p>
        <button onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

const InventoryCard = ({ item, onBuyRest, purchased }) => {
  const isMobile = useSelector((state) => state.appSlice.isMobile);

  const handleImageError = (e) => {
    e.target.src = "../store-images/rootstock.png";
  };
  return (
    <div className="InventoryCard">
      {!isMobile && (
        <img
          src={"." + item.imagePath}
          alt={item.title}
          onError={handleImageError}
        />
      )}
      <div>
        <h3>{item.title}</h3>
        <p>
          You asked for <strong>{item.numInCart}</strong>
        </p>
      </div>
      <div>
        <p>
          We only have <strong>{item.actualInventory}</strong> in stock right
          now
        </p>
        {purchased ? (
          <span className="checkmark">✔</span>
        ) : (
          <button onClick={onBuyRest}>Buy the rest</button>
        )}
      </div>
    </div>
  );
};

export default MissingInventoryModal;
