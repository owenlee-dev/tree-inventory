import "./couponModal.scss";
const CouponModal = ({ storeData, formData, setFormData, show, onClose }) => {
  if (!show) {
    return null;
  }

  // Post formData to google sheets
  const createCoupon = async () => {
    let stringifiedFormData = {
      ...formData,
      whenBuying: formData.whenBuying
        .filter((innerArray) => innerArray.length > 0)
        .map((innerArray) => innerArray.join(", "))
        .join("\nAND \n"),
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/google-sheets/add-coupon`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stringifiedFormData),
        }
      );
      if (response.ok) {
        console.log("added coupon");
      }
    } catch (error) {
      console.error("Error confirming orders:", error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemoveCondition = (groupIndex) => {
    const updatedWhenBuying = formData.whenBuying.filter(
      (_, index) => index !== groupIndex
    );
    setFormData({ ...formData, whenBuying: updatedWhenBuying });
  };

  const handleItemSelection = (groupIndex, itemName) => {
    const updatedGroup = [...formData.whenBuying[groupIndex]];
    const itemIndex = updatedGroup.indexOf(itemName);

    if (itemIndex > -1) {
      updatedGroup.splice(itemIndex, 1);
    } else {
      updatedGroup.push(itemName);
    }

    const updatedWhenBuying = [...formData.whenBuying];
    updatedWhenBuying[groupIndex] = updatedGroup;
    setFormData({ ...formData, whenBuying: updatedWhenBuying });
  };

  // function to flatten storeData into a single list of objects
  const getAllTrees = (storeData) => {
    const allTrees = [];

    for (const category in storeData) {
      if (storeData.hasOwnProperty(category)) {
        const categoryData = storeData[category];

        if (typeof categoryData === "object" && !Array.isArray(categoryData)) {
          // For nested objects like "fruit trees"
          for (const subCategory in categoryData) {
            if (categoryData.hasOwnProperty(subCategory)) {
              allTrees.push(
                ...categoryData[subCategory].flatMap((item) => item)
              );
            }
          }
        } else {
          allTrees.push(...categoryData.flatMap((item) => item));
        }
      }
    }
    return allTrees;
  };

  const handleAddCondition = () => {
    if (formData.whenBuying.length < 6) {
      const updatedWhenBuying = [...formData.whenBuying, []];
      setFormData({ ...formData, whenBuying: updatedWhenBuying });
    }
  };
  const allItems = getAllTrees(storeData);
  return (
    <div className="coupon-modal">
      <div className="coupon-modal-content">
        <div className="coupon-modal-header">
          <h4 className="coupon-modal-title">Create New Coupon</h4>
        </div>
        <div className="coupon-modal-body">
          <p>
            1. Pick a cupon code (ex. SAVE10)
            <br />
            2. Pick coupon savings in $ (ex. 10)
            <br />
            3. Select Conditions for coupon <br />
            (ex. 1: Select all the apples 2: Select all the apples again)
            <br />
            <br />
            Result: When users enter SAVE10 they will save 10$ when they buy two
            apple trees
          </p>
          <form className="coupon-form-container">
            <div className="coupon-form-group">
              <label htmlFor="name">Coupon Code:</label>
              <input
                type="text"
                id="Coupon Code"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleFormChange}
                required
              />
              <label htmlFor="name">Savings:</label>
              <div className="savings-container">
                <input
                  type="text"
                  id="dollarsSaved"
                  name="dollarsSaved"
                  value={formData.dollarsSaved}
                  onChange={handleFormChange}
                  required
                />
                <p>$</p>
              </div>
              <p>When Buying</p>
              <div className="conditions-container">
                {formData.whenBuying.map((group, groupIndex) => (
                  <div className="when-buying-container" key={groupIndex}>
                    <div className="when-buying-header">
                      <p>Condition {groupIndex + 1}</p>
                      <button
                        className="remove-condition-button"
                        onClick={() => handleRemoveCondition(groupIndex)}
                      >
                        X
                      </button>
                    </div>
                    {allItems.map((item) => (
                      <div
                        onClick={() =>
                          handleItemSelection(groupIndex, item.Variety)
                        }
                        key={item.Variety}
                      >
                        <input
                          type="checkbox"
                          id={`${groupIndex}-${item.Variety}`}
                          name={item.Variety}
                          value={item.Variety}
                          checked={group.includes(item.Variety)}
                          onChange={() => {}}
                        />
                        <label htmlFor={`${groupIndex}-${item.Variety}`}>
                          {item.Variety}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
                {formData.whenBuying.length < 6 && (
                  <button
                    className="plus-btn button-animation"
                    type="button"
                    onClick={handleAddCondition}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="coupon-modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={createCoupon} className="btn btn-primary">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
export default CouponModal;
