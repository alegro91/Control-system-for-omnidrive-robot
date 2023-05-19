import React from "react";
import Robot from "../src/components/Robot";
import { renderWithRedux } from "../src/helpers/testHelpers/renderWithRedux";
import { render, screen } from "@testing-library/react";

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
    renderWithRedux(<Robot item={item} />);
  });

  it("renders the Robot component with errors correctly", () => {
    const itemWithError = {
      ...item,
      errors: ["Error 1", "Error 2"],
    };

    renderWithRedux(<Robot item={itemWithError} />);
  });

  it("error names show corretly", () => {
    const itemWithError = {
      ...item,
      errors: ["Error 1", "Error 2"],
    };

    renderWithRedux(<Robot item={itemWithError} />);
  });
});
