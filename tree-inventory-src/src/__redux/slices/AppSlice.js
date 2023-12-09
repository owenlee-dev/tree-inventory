import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "appData",
  initialState: {
    tabSelected: "Store",
    dataFile: {},
  },
  reducers: {
    changeTab: (state, action) => {
      state.tabSelected = action.payload;
    },
    uploadDataFile: (state, action) => {
      state.dataFile = action.payload;
    },
  },
});

// Export actions
export const { changeTab, uploadDataFile } = appSlice.actions;

// Export reducer
export default appSlice.reducer;
