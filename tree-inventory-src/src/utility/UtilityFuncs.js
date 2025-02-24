export function getInventoryForVariety(variety, storeData) {
  for (const categoryKey in storeData) {
    const category = storeData[categoryKey];

    if (categoryKey === "fruit trees") {
      for (const subcategoryKey in category) {
        const items = category[subcategoryKey];

        if (!Array.isArray(items)) {
          console.warn(
            `Expected an array for subcategory "${subcategoryKey}" in "fruit trees", but got ${typeof items}`
          );
          continue; // Skip to the next subcategory
        }

        const item = items.find((item) => item.Variety === variety);
        if (item) {
          const inventory = parseInt(item.Inventory, 10);
          return inventory;
        }
      }
    } else {
      const items = category;

      if (!Array.isArray(items)) {
        console.warn(
          `Expected an array for category "${categoryKey}", but got ${typeof items}`
        );
        continue; // Skip to the next category
      }

      const item = items.find((item) => item.Variety === variety);
      if (item) {
        const inventory = parseInt(item.Inventory, 10);
        return inventory;
      }
    }
  }

  console.warn(`Variety "${variety}" not found in storeData.`);
  return null;
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
};
