export function getInventoryForVariety(variety, storeData) {
  // Loop through each category in storeData
  for (const categoryKey in storeData) {
    const category = storeData[categoryKey];

    // Check if the category has subcategories
    if (categoryKey === "fruit trees") {
      // Handle subcategories for fruit trees
      for (const subcategoryKey in category) {
        const items = category[subcategoryKey];
        // Find the item in the current subcategory's items array
        const item = items.find((item) => item.Variety === variety);
        if (item) {
          // If the item is found, return its Inventory
          return parseInt(item.Inventory, 10);
        }
      }
    } else {
      // Handle categories without subcategories
      const items = category;
      const item = items.find((item) => item.Variety === variety);
      if (item) {
        // If the item is found, return its Inventory
        return parseInt(item.Inventory, 10);
      }
    }
  }

  // If the item is not found in any category or subcategory, return null
  return null;
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
};
