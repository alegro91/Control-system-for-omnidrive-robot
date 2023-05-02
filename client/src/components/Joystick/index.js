import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Circle } from "react-native-svg";

export default function Joystick({
  robotIp,
  steeringType,
  driveMode,
  slowMode,
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(0);
  const debouncedSendJoystickDataRef = useRef(debounce(sendJoystickData, 10));
  const viewRef = useRef(null);

  const minSpeedColor = { r: 80, g: 80, b: 80 }; // Gray
  const maxSpeedColor = { r: 0, g: 200, b: 50 }; // Green

  function sendJoystickData(x, y, normalizedDistance) {
    console.log("slowmode:", slowMode);
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
    event.target.addEventListener("mousemove", handleMove, { passive: false });
    event.target.addEventListener("mouseup", handleEnd, { passive: false });
  };

  const interpolateColor = (color1, color2, speed) => {
    const r = color1.r + (color2.r - color1.r) * speed;
    const g = color1.g + (color2.g - color1.g) * speed;
    const b = color1.b + (color2.b - color1.b) * speed;
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

  const handleTouchStart = (event) => {
    event.preventDefault();
    event.target.addEventListener("touchmove", handleMove, { passive: false });
    event.target.addEventListener("touchend", handleEnd, { passive: false });
    event.target.addEventListener("touchcancel", handleEnd, { passive: false });
  };

  const handleMove = (event) => {
    const { pageX, pageY, target, touches } = event.nativeEvent;
    const { left, top } = viewRef.current.getBoundingClientRect();

    let x, y;

    if (touches && touches.length > 0) {
      x = touches[0].pageX - left - 150;
      y = touches[0].pageY - top - 150;
    } else {
      x = pageX - left - 150;
      y = pageY - top - 150;
    }

    // Calculate the distance from the center.
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 110;

    // Clamp the position within the circle boundary.
    if (distance > maxDistance) {
      x = (x / distance) * maxDistance;
      y = (y / distance) * maxDistance;
    }

    const normalizedDistance = distance / maxDistance;

    setPosition({ x, y });

    // Calculate the speed based on the normalized distance
    const speed = normalizedDistance.toFixed(2);
    setSpeed(speed);

    debouncedSendJoystickDataRef.current(x, y, normalizedDistance);
  };

  const handleEnd = () => {
    setPosition({ x: 0, y: 0 });
    setSpeed(0);
    sendJoystickData(0, 0, 0);
  };

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      viewRef.current.addEventListener("touchend", handleEnd, {
        passive: false,
      });
      viewRef.current.addEventListener("touchcancel", handleEnd, {
        passive: false,
      });
      viewRef.current.addEventListener("touchmove", handleMove, {
        passive: false,
      });

      viewRef.current.addEventListener("mousedown", handleStart, {
        passive: false,
      });
      viewRef.current.addEventListener("mouseup", handleEnd, {
        passive: false,
      });
      viewRef.current.addEventListener("mousemove", handleMove, {
        passive: false,
      });
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.removeEventListener("touchstart", handleTouchStart);
        viewRef.current.removeEventListener("touchend", handleEnd);
        viewRef.current.removeEventListener("touchcancel", handleEnd);
        viewRef.current.removeEventListener("touchmove", handleMove);

        viewRef.current.removeEventListener("mousedown", handleStart);
        viewRef.current.removeEventListener("mouseup", handleEnd);
        viewRef.current.removeEventListener("mousemove", handleMove);
      }
    };
  }, []);

  return (
    <View ref={viewRef} style={styles.viewContainer}>
      <Svg height="300" width="300" style={styles.joystickContainer}>
        <Circle cx="150" cy="150" r="110" fill="rgba(200, 200, 200, 0.3)" />
        <Circle
          cx={150 + position.x}
          cy={150 + position.y}
          r="40"
          fill={interpolateColor(minSpeedColor, maxSpeedColor, speed)}
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
