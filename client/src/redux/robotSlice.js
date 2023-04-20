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
  },
});

export const { updateRobotIP } = robotSlice.actions;
export default robotSlice.reducer;
