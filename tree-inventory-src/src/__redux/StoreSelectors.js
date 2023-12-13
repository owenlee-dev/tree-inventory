import { createSelector } from "reselect";

// Selector to get the raw data from the store
const selectRawStoreData = (state) => state.storeSlice.googleSheetData;

// Memoized selector for a specific part of the store data
export const selectFruitTrees = createSelector(
  [selectRawStoreData],
  (googleSheetData) => googleSheetData["fruit trees"] || {}
);
