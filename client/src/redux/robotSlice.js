import { createSlice } from "@reduxjs/toolkit";

export const robotSlice = createSlice({
  name: "robot",
  initialState: {
    robotIP: "",
    robots: [],
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
  },
});

export const { updateRobotIP, disconnectRobot, updateRobots, clearRobots } =
  robotSlice.actions;
export default robotSlice.reducer;
