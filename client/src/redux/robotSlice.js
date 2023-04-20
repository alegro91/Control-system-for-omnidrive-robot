import { createSlice } from "@reduxjs/toolkit";

export const robotSlice = createSlice({
  name: "robot",
  initialState: {
    robotIP: "",
  },
  reducers: {
    updateRobotIP: (state, action) => {
      state.robotIP = action.payload;
    },
    disconnectRobot: (state) => {
      state.robotIP = "";
    },
  },
});

export const { updateRobotIP, disconnectRobot } = robotSlice.actions;
export default robotSlice.reducer;
