// store.js
import { configureStore } from "@reduxjs/toolkit";
import headerAnimationSlice from "./slices/headerAnimationSlice";

//useSelector hook to access the values in the store
// const count = useSelector((state) => state.counter.value);

//useDispatch hook to dispatch actions
//onClick={() => dispatch(increment())}>Increment</button>

export const store = configureStore({
  reducer: {
    counter: headerAnimationSlice,
  },
});
