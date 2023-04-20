import { configureStore } from "@reduxjs/toolkit";
import robotReducer from "./robotSlice";

const store = configureStore({
  reducer: {
    robot: robotReducer,
  },
});

export default store;
