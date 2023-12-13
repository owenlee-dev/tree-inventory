import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { baseStoreData } from "../BaseStoreData";

export const fetchStoreData = createAsyncThunk(
  "storeData/fetchStoreData",
  async () => {
    const response = await fetch("http://localhost:3001/api/store-data");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  }
);

export const storeSlice = createSlice({
  name: "storeData",
  initialState: {
    googleSheetData: baseStoreData,
    cartContents: [],
    numItemsInCart: 0,
    status: "idle",
  },
  reducers: {
    addToCart: (state, action) => {
      // make sure that there is inventory of the item before adding it to the cart
      if (action.payload.inventory > 0) {
        const existingItem = state.cartContents.find(
          (item) => item.title === action.payload.title
        );
        if (existingItem) {
          // increment
          existingItem.numInCart =
            (existingItem.numInCart || 0) + action.payload.numInCart;
          state.numItemsInCart += action.payload.numInCart;
        } else {
          // add new item to cart
          const newItem = { ...action.payload };
          state.numItemsInCart += action.payload.numInCart;
          state.cartContents.push(newItem);
        }
      }
    },
    removeFromCart: (state, action) => {
      state.cartContents = state.cartContents.filter(
        (product) => product.title !== action.payload
      );
      state.numItemsInCart -= action.payload.numInCart;
    },
    updateCartItemQuantity: (state, action) => {
      const { title, newQuantity } = action.payload;
      const product = state.cartContents.find(
        (product) => product.title === title
      );
      if (product) {
        let oldQuantity = product.numInCart;
        product.numInCart = newQuantity;
        state.numItemsInCart = state.numItemsInCart - oldQuantity + newQuantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStoreData.fulfilled, (state, action) => {
        state.googleSheetData = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchStoreData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// Selector to get the raw data from the store
// const selectRawStoreData = (state) => state.storeSlice.googleSheetData;

// // Memoized selector for a specific part of the store data
// export const selectFruitTrees = createSelector(
//   [selectRawStoreData],
//   (googleSheetData) => googleSheetData["fruit trees"] || {}
// );

// Export actions
export const { addToCart, removeFromCart, updateCartItemQuantity } =
  storeSlice.actions;

// Export reducer
export default storeSlice.reducer;
