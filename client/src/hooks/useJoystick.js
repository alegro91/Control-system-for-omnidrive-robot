import { useState, useRef } from "react";

export default function useJoystick({ robotIp, steeringType, driveMode }) {
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

  return { position, setPosition, debouncedSendJoystickDataRef };
}
