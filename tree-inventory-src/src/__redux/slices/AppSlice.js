import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "appData",
  initialState: {
    tabSelected: "Store",
    dataFile: {},
    isMobile: false,
  },
  reducers: {
    changeTab: (state, action) => {
      state.tabSelected = action.payload;
    },
    uploadDataFile: (state, action) => {
      state.dataFile = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

// Export actions
export const { changeTab, uploadDataFile, setIsMobile } = appSlice.actions;

// Export reducer
export default appSlice.reducer;
