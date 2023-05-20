import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const DistanceBar = ({ distance, threshold }) => {
  const barWidth =
    distance > threshold ? "100%" : `${(distance / threshold) * 100}%`;

  const barColor = distance <= threshold ? "#77DD77" : "#F05555";

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <LinearGradient
          colors={[barColor, barColor]}
          style={[styles.bar, { width: barWidth }]}
        />
        {distance <= threshold && (
          <View
            style={[
              styles.indicator,
              { left: `${(threshold / distance) * 100}%` },
            ]}
          />
        )}
      </View>

      <Text style={styles.distanceText}>{distance} meters</Text>
      <Text
        style={{
          fontSize: 12,
        }}
      >
        Max distance: {threshold} meters
      </Text>

      {distance <= threshold && (
        <Text style={styles.messageText}>You can drive the robot</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: -40,
  },
  barContainer: {
    position: "relative",
    backgroundColor: "lightgray",
    height: 10,
    borderRadius: 10,
    width: "100%",
  },
  bar: {
    height: "100%",
    borderRadius: 10,
  },
  indicator: {
    position: "absolute",
    backgroundColor: "red",
    width: 2,
    height: "100%",
  },
  distanceText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  messageText: {
    marginTop: 10,
    fontSize: 18,
    marginBottom: 60,
    fontWeight: "bold",
    color: "green",
  },
});

export default DistanceBar;
