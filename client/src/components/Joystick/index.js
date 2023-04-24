import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Circle } from "react-native-svg";

export default function Joystick({ robotIp, steeringType, driveMode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const debouncedSendJoystickDataRef = useRef(debounce(sendJoystickData, 10));
  const viewRef = useRef(null);

  function sendJoystickData(x, y, normalizedDistance) {
    /*
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

  const handleTouchStart = (event) => {
    event.preventDefault();
    event.target.addEventListener("touchmove", handleMove, { passive: false });
    event.target.addEventListener("touchend", handleEnd, { passive: false });
    event.target.addEventListener("touchcancel", handleEnd, { passive: false });
  };

  const handleMove = (event) => {
    const { pageX, pageY, target, touches } = event.nativeEvent;
    const { left, top } = target.getBoundingClientRect();

    let x, y;

    if (touches && touches.length > 0) {
      x = touches[0].pageX - left - 100;
      y = touches[0].pageY - top - 100;
    } else {
      x = pageX - left - 100;
      y = pageY - top - 100;
    }

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
      <Svg height="400" width="400" style={styles.joystickContainer}>
        <Circle cx="200" cy="200" r="100" fill="rgba(200, 200, 200, 0.3)" />
        <Circle
          cx={200 + position.x}
          cy={200 + position.y}
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
