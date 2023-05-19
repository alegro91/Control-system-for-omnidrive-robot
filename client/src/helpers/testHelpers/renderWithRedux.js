import { configureStore } from "@reduxjs/toolkit";
import robotSlice from "../../redux/robotSlice";
import { Provider } from "react-redux";

export function renderWithRedux(renderComponent) {
  const store = configureStore({
    reducer: {
      robot: robotSlice,
    },
  });

  return {
    ...renderComponent,
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  };
}
