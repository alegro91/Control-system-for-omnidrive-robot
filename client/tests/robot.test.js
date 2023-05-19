import React from "react";
import { render } from "@testing-library/react-native";
import Robot from "../src/components/Robot";

jest.mock("@expo/vector-icons", () =>
  require("./__mocks__/expo-vector-icons.mock")
);

describe("Robot component", () => {
  const item = {
    agv_id: "Robot1",
    state: "Idle",
    battery_capacity: 90,
    errors: [],
    location: "Warehouse A",
  };

  it("renders the Robot component correctly", () => {
    const { getByTestId, getByText } = render(<Robot item={item} />);
  });

  it("renders the Robot component with errors correctly", () => {
    const itemWithError = {
      ...item,
      errors: ["Error 1", "Error 2"],
    };

    const { getByTestId, getByText } = render(<Robot item={itemWithError} />);
  });

  it("handles button press correctly", () => {
    const mockHandleRobotConnect = jest.fn();
    const { getByTestId } = render(<Robot item={item} />);
  });
});
