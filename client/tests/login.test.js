import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Login from "../src/components/Login";

jest.mock("@expo/vector-icons", () =>
  require("./__mocks__/expo-vector-icons.mock")
);

jest.mock("expo-linear-gradient", () =>
  require("./__mocks__/expo-linear-gradient.mock")
);

const mockStore = configureStore([]);

describe("Login component", () => {
  it("should handle login successfully", async () => {
    const store = mockStore({});

    const { getByTestId } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  });

  it("should handle invalid password", async () => {
    const store = mockStore({});

    const { getByTestId } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  });
});
