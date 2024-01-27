import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { baseStoreData } from "../BaseStoreData";
import Coupon from "../../components/classes/Coupon";
export const fetchStoreData = createAsyncThunk(
  "storeData/fetchStoreData",
  async () => {
    console.log("getting store data");
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/google-sheets/store-data`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log(response.json());
    const data = await response.json();
    console.log(data);
    return data;
  }
);
export const fetchPickupLocations = createAsyncThunk(
  "storeData/fetchPickupLocations",
  async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/google-sheets/pickup-locations`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  }
);

export const fetchValidCoupons = createAsyncThunk(
  "storeData/fetchValidCoupons",
  async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/google-sheets/valid-coupons`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const couponsRaw = await response.json();
    let coupons = [];
    couponsRaw.forEach((couponData) => {
      coupons.push({
        code: couponData["CODE"],
        whenBuying: stringToArrayOfArrays(couponData["WHEN BUYING"]),
        dollarsSaved: couponData["DOLLARS SAVED"],
        description: couponData["DESCRIPTION"],
        isAdvertised: couponData["ADVERTISED"],
      });
    });
    return coupons;
  }
);

export const storeSlice = createSlice({
  name: "storeData",
  initialState: {
    googleSheetData: baseStoreData,
    pickupLocations: [],
    validCoupons: [],
    cartContents: [],
    appliedCoupon: {},
    numItemsInCart: 0,
    status: "idle",
  },
  reducers: {
    changeAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    addToCart: (state, action) => {
      // make sure that there is inventory of the item before adding it to the cart
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
    },
    removeFromCart: (state, action) => {
      const originalLength = state.cartContents.reduce(
        (sum, product) => sum + product.numInCart,
        0
      );
      state.cartContents = state.cartContents.filter(
        (product) => product.title !== action.payload
      );
      const newLength = state.cartContents.reduce(
        (sum, product) => sum + product.numInCart,
        0
      );

      let numItemsRemoved = originalLength - newLength;
      state.numItemsInCart -= numItemsRemoved;
    },
    clearCart: (state, action) => {
      state.cartContents = [];
      state.numItemsInCart = 0;
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
      // STORE DATA
      .addCase(fetchStoreData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStoreData.fulfilled, (state, action) => {
        state.googleSheetData = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchStoreData.rejected, (state) => {
        state.status = "failed";
      })
      // PICKUP LOCATIONS
      .addCase(fetchPickupLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPickupLocations.fulfilled, (state, action) => {
        state.pickupLocations = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPickupLocations.rejected, (state) => {
        state.status = "failed";
      })
      // COUPONS
      .addCase(fetchValidCoupons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchValidCoupons.fulfilled, (state, action) => {
        state.validCoupons = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchValidCoupons.rejected, (state) => {
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
export const {
  addToCart,
  changeAppliedCoupon,
  removeFromCart,
  updateCartItemQuantity,
  getValidCoupons,
  clearCart,
} = storeSlice.actions;

// Export reducer
export default storeSlice.reducer;

// helper function to translate coupon string into an array of arrays
function stringToArrayOfArrays(str) {
  if (!str || str.trim() === "") {
    return [];
  }

  return str.split("\nAND \n").map((group) => group.split(", "));
}
