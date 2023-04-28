import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { PanGestureHandler } from "react-native-gesture-handler";

export default function JoystickNative({ robotIp, steeringType, driveMode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function sendJoystickData(x, y, normalizedDistance) {
    // Your sendJoystickData implementation
  }

  function onGestureEvent(event) {
    const { nativeEvent } = event;
    let x = nativeEvent.translationX;
    let y = nativeEvent.translationY;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;

    if (distance > maxDistance) {
      x = (x / distance) * maxDistance;
      y = (y / distance) * maxDistance;
    }

    const normalizedDistance = distance / maxDistance;

    setPosition({ x, y });
    sendJoystickData(x, y, normalizedDistance);
  }

  function onHandlerStateChange(event) {
    const { nativeEvent } = event;

    if (
      nativeEvent.oldState === 4 || // State.END
      nativeEvent.oldState === 5 // State.CANCELLED
    ) {
      setPosition({ x: 0, y: 0 });
      sendJoystickData(0, 0, 0);
    }
  }

  return (
    <View style={styles.viewContainer}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Svg height="400" width="400" style={styles.joystickContainer}>
          <Circle cx="200" cy="200" r="100" fill="rgba(200, 200, 200, 0.3)" />
          <Circle
            cx={200 + position.x}
            cy={200 + position.y}
            r="50"
            fill="rgba(80, 80, 80, 0.7)"
          />
        </Svg>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: "center",
  },
  joystickContainer: {},
});
