import React from "react";
import { View, StyleSheet } from "react-native";

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.square} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  square: {
    width: 200,
    height: 200,
    backgroundColor: "gray",
  },
});

export default MapScreen;
