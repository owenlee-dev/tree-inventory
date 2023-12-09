import { createSlice } from "@reduxjs/toolkit";

export const storeSlice = createSlice({
  name: "storeData",
  initialState: {
    cartContents: [],
    numItemsInCart: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartContents.find(
        (item) => item.title === action.payload.title
      );
      if (existingItem) {
        existingItem.numInCart =
          (existingItem.numInCart || 0) + action.payload.numInCart;
        state.numItemsInCart += action.payload.numInCart;
      } else {
        const newItem = { ...action.payload };
        state.numItemsInCart += action.payload.numInCart;
        state.cartContents.push(newItem);
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
});

// Export actions
export const { addToCart, removeFromCart, updateCartItemQuantity } =
  storeSlice.actions;

// Export reducer
export default storeSlice.reducer;
