import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Login from "../src/components/Login";
import { SafeAreaProvider } from "react-native-safe-area-context";

//jest.mock("@expo/vector-icons", () => require("./__mocks__/expo-vector-icons"));

describe("Login component", () => {
  it("displays success message after successful login", async () => {
    const setAuthenticated = jest.fn();

    const { getByTestId } = render(
      <SafeAreaProvider>
        <Login setAuthenticated={setAuthenticated} />
      </SafeAreaProvider>
    );

    // Simulate entering a valid password
    const passwordInput = getByTestId("password-input");
    fireEvent.changeText(passwordInput, "admin");

    // Simulate button press
    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    // Wait for login request to complete and success message to show
    await waitFor(() =>
      expect(getByTestId("snackbar")).toHaveTextContent("Login successful")
    );

    // Assert authenticated state is set
    expect(setAuthenticated).toHaveBeenCalledWith(true);
  });

  it("displays error message after invalid login", async () => {
    const setAuthenticated = jest.fn();

    const { getByTestId } = render(
      <SafeAreaProvider>
        <Login setAuthenticated={setAuthenticated} />
      </SafeAreaProvider>
    );

    // Simulate entering an invalid password
    const passwordInput = getByTestId("password-input");
    fireEvent.changeText(passwordInput, "wrong-password");

    // Simulate button press
    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    // Wait for login request to complete and error message to show
    await waitFor(() =>
      expect(getByTestId("snackbar")).toHaveTextContent("Invalid password")
    );

    // Assert authenticated state is not set
    expect(setAuthenticated).not.toHaveBeenCalled();
  });
});
