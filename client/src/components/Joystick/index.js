import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Circle } from "react-native-svg";

export default function Joystick({ robotIp, steeringType, driveMode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const debouncedSendJoystickDataRef = useRef(debounce(sendJoystickData, 100));

  function sendJoystickData(x, y, normalizedDistance) {
    const url = `http://${robotIp}:5656/control`;
    const data = {
      x: x,
      y: y,
      speed: normalizedDistance,
      steeringType: steeringType,
      driveMode: driveMode,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.error("Error:", error);
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleStart = (event) => {
    event.preventDefault();
  };

  const handleTouchStart = (event) => {
    event.preventDefault();
    event.target.addEventListener("touchmove", handleMove, { passive: false });
    event.target.addEventListener("touchend", handleEnd, { passive: false });
    event.target.addEventListener("touchcancel", handleEnd, { passive: false });
  };

  const handleMove = (event) => {
    const { pageX, pageY, target } = event.nativeEvent;
    const { left, top } = target.getBoundingClientRect();

    let x = pageX - left - 100;
    let y = pageY - top - 100;

    // Calculate the distance from the center.
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;

    // Clamp the position within the circle boundary.
    if (distance > maxDistance) {
      x = (x / distance) * maxDistance;
      y = (y / distance) * maxDistance;
    }

    const normalizedDistance = distance / maxDistance;

    setPosition({ x, y });

    debouncedSendJoystickDataRef.current(x, y, normalizedDistance);
  };

  const handleEnd = () => {
    setPosition({ x: 0, y: 0 });
    sendJoystickData(0, 0, 0);
  };

  return (
    <View
      onStartShouldSetResponder={handleStart}
      onResponderGrant={handleStart}
      onResponderMove={handleMove}
      onResponderRelease={handleEnd}
      onResponderTerminate={handleEnd}
      onTouchStart={handleTouchStart}
      style={styles.viewContainer}
    >
      <Svg height="200" width="200" style={styles.joystickContainer}>
        <Circle cx="100" cy="100" r="100" fill="rgba(200, 200, 200, 0.3)" />
        <Circle
          cx={100 + position.x}
          cy={100 + position.y}
          r="50"
          fill="rgba(80, 80, 80, 0.7)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: "center",
  },
  joystickContainer: {},
});
