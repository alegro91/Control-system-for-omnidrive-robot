import { useState as useStateMock, useEffect as useEffectMock } from "react";
import { useDispatch as useDispatchMock, useSelector as useSelectorMock } from "react-redux";
import useRobots from "../src/socket/useRobots";

jest.mock("react-native", () => ({
    Platform: {
      OS: "web",
    },
  }));
  
  jest.mock("@react-native-community/netinfo", () => ({
    fetch: jest.fn(() => Promise.resolve({ details: { ipAddress: "192.168.1.1" } })),
  }));
  
  jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: jest.fn(),
    useEffect: jest.fn(),
  }));
  
  jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  }));
  
  describe("useRobots", () => {
    beforeEach(() => {
      useStateMock.mockImplementation((init) => [init, jest.fn()]);
      useDispatchMock.mockReturnValue(jest.fn());
      useSelectorMock.mockImplementation((selectorFn) => selectorFn({ robot: { robots: [], locations: [] } }));

    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("properly adds fake robots", () => {
        const fakeRobots = [
        {
          agv_id: "Robot 1",
          state: "Idle",
          battery_capacity: 100,
          location: "A1",
          last_location: "",
          loaded: false,
          errors: [{ id: "1", errorMessage: "Error 1" }],
        },
        {
          agv_id: "Robot 2",
          state: "Moving",
          battery_capacity: 50,
          location: "A2",
          last_location: "",
          loaded: false,
          errors: [],
        },
        {
          agv_id: "Robot 3",
          state: "Charging",
          battery_capacity: 0,
          location: "A3",
          last_location: "",
          loaded: false,
          errors: [],
        },
      ];
  
        useSelectorMock.mockImplementation((selectorFn) => selectorFn({ robot: { robots: fakeRobots, locations: [] } }));
        const { robots } = useRobots();
  
        expect(robots).toEqual(fakeRobots);
    });
  });

  it("returns an empty array when useSelector provides no robots", () => {
    useSelectorMock.mockImplementation((selectorFn) => selectorFn({ robot: { robots: undefined, locations: [] } }));
    
    const { robots } = useRobots();
  
    expect(robots).toEqual([]);
  });
  
