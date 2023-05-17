import { createSlice } from "@reduxjs/toolkit";

export const robotSlice = createSlice({
  name: "robot",
  initialState: {
    robotIP: "",
    robots: [],
    locations: [],
    authenticated: false,
    user: null,
  },
  reducers: {
    updateRobotIP: (state, action) => {
      state.robotIP = action.payload;
    },
    disconnectRobot: (state) => {
      state.robotIP = "";
    },
    updateRobots: (state, action) => {
      state.robots = action.payload;
    },
    clearRobots: (state) => {
      state.robots = [];
    },
    updateLocations: (state, action) => {
      state.locations = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  updateRobotIP,
  disconnectRobot,
  updateRobots,
  clearRobots,
  updateLocations,
  setAuthenticated,
  setUser,
} = robotSlice.actions;

export default robotSlice.reducer;
