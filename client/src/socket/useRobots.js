import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { useDispatch, useSelector } from "react-redux";

import { updateRobots, disconnectRobot } from "../redux/robotSlice";

const useRobots = () => {
  const robotsState = useSelector((state) => state.robot.robots);
  const [robots, setRobots] = useState(
    useSelector((state) => state.robot.robots) || []
  );
  const [socket, setSocket] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [searching, setSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [error, setError] = useState(false);
  const [robotDiscoveryFinished, setRobotDiscoveryFinished] = useState(false);

  const robots_ = [
    {
      agv_id: "Robot 1",
      state: "Idle",
      battery_capacity: 100,
      location: "A1",
      last_location: "",
      loaded: false,
      errors: [{ id: "1", errorMessage: "Error 1" }],
    },
    {
      agv_id: "Robot 2",
      state: "Moving",
      battery_capacity: 50,
      location: "A2",
      last_location: "",
      loaded: false,
      errors: [],
    },
    {
      agv_id: "Robot 3",
      state: "Charging",
      battery_capacity: 0,
      location: "A3",
      last_location: "",
      loaded: false,
      errors: [],
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      //startMdnsScan(); // uncomment this line to start scanning automatically
    }
  }, [socket]);

  useEffect(() => {
    console.log("robots state changed", robotsState);
  }, [robotsState]);

  useEffect(() => {
    if (robotDiscoveryFinished) {
      console.log("robots discovered", robots);
      dispatch(updateRobots(robots));
    }
  }, [robotDiscoveryFinished]);

  useEffect(() => {
    if (Platform.OS === "web") {
      const newSocket = io("http://localhost:3000");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        // Set socket connected state when socket connects
        setSocketConnected(true);
        setSearching(false);
        setError(false);
      });

      const connectionTimeout = setTimeout(() => {
        if (!socketConnected) {
          setError(true);
        }
      }, 10000); // 10 seconds timeout

      newSocket.on("disconnect", () => {
        // Set socket connected state when socket disconnects
        setSocketConnected(false);
      });

      newSocket.on("robot-discovered", (robotServices) => {
        //setScanStatus("discovering");
        setRobotDiscoveryFinished(false);
        robotServices.forEach((robot, index) => {
          setRobots((prevRobots) => [...prevRobots, robot]);
          if (index === robotServices.length - 1) {
            // If this is the last robot in the array, set the flag to indicate that the loop has finished
            setRobotDiscoveryFinished(true);
          }
        });
      });

      newSocket.on("scan-complete", () => {
        setScanStatus("idle");
      });

      return () => {
        newSocket.close();
        clearTimeout(connectionTimeout); // Clear the timeout
      };
    } else {
      NetInfo.fetch().then((state) => {
        const ipAddress = state.details.ipAddress;
        console.log("Device IP address:", ipAddress);

        const serverAddress = `http://192.168.128.58:3000`; // replace ip address with ${ipAddress} to use the servers IP address
        const newSocket = io(serverAddress);
        setSocket(newSocket);

        newSocket.on("connect", () => {
          // Set socket connected state when socket connects
          setSocketConnected(true);
          setError(false);
          setSearching(false);
        });

        const connectionTimeout = setTimeout(() => {
          if (!socketConnected) {
            setError(true);
          }
        }, 10000); // 10 seconds timeout

        newSocket.on("disconnect", () => {
          // Set socket connected state when socket disconnects
          setSocketConnected(false);
        });

        newSocket.on("robot-discovered", (robotServices) => {
          setRobotDiscoveryFinished(false);
          robotServices.forEach((robot, index) => {
            setRobots((prevRobots) => [...prevRobots, robot]);
            if (index === robotServices.length - 1) {
              // If this is the last robot in the array, set the flag to indicate that the loop has finished
              setRobotDiscoveryFinished(true);
            }
          });
        });

        newSocket.on("scan-complete", () => {
          setScanStatus("idle");
        });

        return () => {
          newSocket.close();
          clearTimeout(connectionTimeout); // Clear the timeout
        };
      });
    }
  }, []);

  const startMdnsScan = () => {
    if (socket) {
      setRobots([]);
      dispatch(updateRobots([]));
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
    error,
  };
};

export default useRobots;
