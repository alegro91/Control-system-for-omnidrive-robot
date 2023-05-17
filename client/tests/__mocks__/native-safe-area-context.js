import React from "react";

export const SafeAreaView = ({ children }) => <>{children}</>;
export const SafeAreaProvider = ({ children }) => <>{children}</>;
export const useSafeAreaInsets = () => {
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
};

export const initialWindowMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};
