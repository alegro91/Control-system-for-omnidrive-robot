import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistedReducer from "./persistConfig";

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
