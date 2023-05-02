import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { PanGestureHandler } from "react-native-gesture-handler";

export default function JoystickNative({
  robotIp,
  steeringType,
  driveMode,
  slowMode,
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(0);

  const minSpeedColor = { r: 80, g: 80, b: 80 }; // Gray
  const maxSpeedColor = { r: 0, g: 200, b: 50 }; // Green

  function sendJoystickData(x, y, normalizedDistance) {
    const angle = Math.atan2(y, x);
    const slowModeFactor = slowMode ? 0.1 : 1;
    const slowModeClamp = 0.1; // Set the maximum allowed value when in slow mode
    const vectorX = normalizedDistance * slowModeFactor * Math.cos(angle);
    const vectorY = normalizedDistance * slowModeFactor * Math.sin(angle);

    // Clamp the vectorized output based on the current mode (slow or normal)
    const clampedVectorX = slowMode
      ? Math.min(Math.max(vectorX, -slowModeClamp), slowModeClamp).toFixed(2)
      : Math.min(Math.max(vectorX, -1), 1).toFixed(2);
    const clampedVectorY = slowMode
      ? Math.min(Math.max(vectorY, -slowModeClamp), slowModeClamp).toFixed(2)
      : Math.min(Math.max(vectorY, -1), 1).toFixed(2);

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

  const interpolateColor = (color1, color2, speed) => {
    const r = color1.r + (color2.r - color1.r) * speed;
    const g = color1.g + (color2.g - color1.g) * speed;
    const b = color1.b + (color2.b - color1.b) * speed;
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

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

    const speed = normalizedDistance.toFixed(2);
    setSpeed(speed);

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
      setSpeed(0);
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
            fill={interpolateColor(minSpeedColor, maxSpeedColor, speed)}
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
