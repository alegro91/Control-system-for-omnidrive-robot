import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { robotSlice } from "./robotSlice";
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  robot: robotSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
