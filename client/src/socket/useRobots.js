import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const useRobots = () => {
  const [robots, setRobots] = useState([]);
  const [socket, setSocket] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [searching, setSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (socket) {
      //startMdnsScan(); // uncomment this line to start scanning automatically
    }
  }, [socket]);

  useEffect(() => {
    if (Platform.OS === "web") {
      const newSocket = io("http://localhost:3000");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        // Set socket connected state when socket connects
        setSocketConnected(true);
      });

      newSocket.on("disconnect", () => {
        // Set socket connected state when socket disconnects
        setSocketConnected(false);
      });

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
    } else {
      NetInfo.fetch().then((state) => {
        const ipAddress = state.details.ipAddress;
        console.log("Device IP address:", ipAddress);

        const serverAddress = `http://192.168.128.15:3000`; // replace ip address with ${ipAddress} to use the servers IP address
        const newSocket = io(serverAddress);
        setSocket(newSocket);

        newSocket.on("connect", () => {
          // Set socket connected state when socket connects
          setSocketConnected(true);
        });

        newSocket.on("disconnect", () => {
          // Set socket connected state when socket disconnects
          setSocketConnected(false);
        });

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
      });
    }
  }, []);

  const startMdnsScan = () => {
    if (socket) {
      setScanStatus("scanning");
      setSearching(true);
      socket.emit("start-scan");
    }
  };

  const stopMdnsScan = () => {
    if (socket) {
      socket.emit("stop-scan");
      setSearching(false);
      setScanStatus("idle");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("scan-complete", () => {
        setSearching(false);
      });
    }
  }, [socket]);

  return {
    robots,
    startMdnsScan,
    stopMdnsScan,
    searching,
    scanStatus,
    socketConnected,
  };
};

export default useRobots;
