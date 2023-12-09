// store.js
import { configureStore } from "@reduxjs/toolkit";
import storeDataReducer from "./slices/StoreSlice";
import appDataReducer from "./slices/AppSlice";

//useSelector hook to access the values in the store
// const count = useSelector((state) => state.counter.value);

//useDispatch hook to dispatch actions
//onClick={() => dispatch(increment())}>Increment</button>

export const store = configureStore({
  reducer: {
    storeSlice: storeDataReducer,
    appSlice: appDataReducer,
  },
});
