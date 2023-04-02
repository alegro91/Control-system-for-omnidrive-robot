import { useState, useEffect } from "react";
import io from "socket.io-client";

const useRobots = () => {
  const [robots, setRobots] = useState([]);
  const [socket, setSocket] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle"); // Add this line

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("robot-discovered", (robotServices) => {
      setScanStatus("discovering");
      robotServices.forEach((service) => {
        setRobots((prevRobots) => [...prevRobots, { id: service.data }]);
      });
    });

    newSocket.on("scan-complete", () => {
      setScanStatus("idle");
    });

    return () => newSocket.close();
  }, []);

  const startMdnsScan = () => {
    if (socket) {
      setScanStatus("scanning");
      socket.emit("start-mdns-scan");
    }
  };

  const stopMdnsScan = () => {
    if (socket) {
      socket.emit("stop-mdns-scan");
      setScanStatus("idle");
    }
  };

  return { robots, startMdnsScan, stopMdnsScan, scanStatus }; // Update this line
};

export default useRobots;
