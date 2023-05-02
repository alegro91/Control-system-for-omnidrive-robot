import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { PanGestureHandler } from "react-native-gesture-handler";

export default function JoystickNative({ robotIp, steeringType, driveMode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function sendJoystickData(x, y, normalizedDistance) {
    const angle = Math.atan2(y, x);
    const vectorX = normalizedDistance * Math.cos(angle);
    const vectorY = normalizedDistance * Math.sin(angle);

    // Clamp the vectorized output between 0 and 1
    const clampedVectorX = Math.min(Math.max(vectorX, -1), 1).toFixed(2);
    const clampedVectorY = Math.min(Math.max(vectorY, -1), 1).toFixed(2);

    console.log("Clamped vectorized output:", {
      x: clampedVectorX,
      y: clampedVectorY,
    });

    // Replace the URL with your desired endpoint
    /*
    const url = `http://${robotIp}/move`;
    const payload = {
      x: vectorX.toFixed(2),
      y: vectorY.toFixed(2),
    };
  
    axios
      .post(url, payload)
      .then((response) => {
        console.log("POST request successful:", response.data);
      })
      .catch((error) => {
        console.error("POST request failed:", error);
      });
    */
  }

  function onGestureEvent(event) {
    const { nativeEvent } = event;
    let x = nativeEvent.translationX;
    let y = nativeEvent.translationY;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 110;

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
        <Svg height="300" width="300" style={styles.joystickContainer}>
          <Circle cx="150" cy="150" r="110" fill="rgba(200, 200, 200, 0.3)" />
          <Circle
            cx={150 + position.x}
            cy={150 + position.y}
            r="40"
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
