import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { useDispatch, useSelector } from "react-redux";

import {
  updateRobots,
  disconnectRobot,
  updateLocations,
} from "../redux/robotSlice";

const useRobots = () => {
  const robotsState = useSelector((state) => state.robot.robots);
  const [robots, setRobots] = useState(
    useSelector((state) => state.robot.robots) || [
      {
        agv_id: "Basement Dweller",
        state: "Idle",
        battery_capacity: 100,
        location: "C 1346",
        last_location: "C 1484",
        loaded: true,
        ip: "192.168.254.123",
        x: -64,
        y: 32,
      },
      {
        agv_id: "Lightning McQueen",
        state: "Moving",
        battery_capacity: 50,
        location: "C 1484",
        last_location: "C 1346",
        loaded: false,
        ip: "192.168.254.124",
        x: -62,
        y: 25,
      },
    ]
  );
  const [locations, setLocations] = useState(
    useSelector((state) => state.robot.locations) || [
      { name: "C 1418", x: 0, y: 0 },
      { name: "C 1419", x: 0, y: 0 },
      { name: "C 1420", x: 0, y: 0 },
      { name: "C 1421", x: 0, y: 0 },
      { name: "A 1134", x: 0, y: 0 },
      { name: "A 1135", x: 0, y: 0 },
      { name: "A 1136", x: 0, y: 0 },
      { name: "A 1137", x: 0, y: 0 },
      { name: "G 0019", x: 0, y: 0 },
      { name: "G 0020", x: 0, y: 0 },
      { name: "G 0021", x: 0, y: 0 },
      { name: "G 0022", x: 0, y: 0 },
      { name: "G 0023", x: 0, y: 0 },
      { name: "G 0024", x: 0, y: 0 },
      { name: "G 0025", x: 0, y: 0 },
      { name: "G 0026", x: 0, y: 0 },
    ]
  );
  const [socket, setSocket] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [searching, setSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [error, setError] = useState(false);
  const [robotDiscoveryFinished, setRobotDiscoveryFinished] = useState(false);

  const [goToLocationStatus, setGoToLocationStatus] = useState({
    type: "idle",
    text: "",
    status: "Idle",
  });

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
      const newSocket = io("http://localhost:3002");
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

      newSocket.on("robot-updated", (updatedRobot) => {
        setRobots((prevRobots) => {
          const updatedRobots = prevRobots.map((robot) => {
            if (robot.agv_id === updatedRobot.agv_id) {
              return { ...robot, ...updatedRobot };
            }
            return robot;
          });
          dispatch(updateRobots(updatedRobots));
          return updatedRobots;
        });
      });

      newSocket.on("locations-discovered", (locations) => {
        setLocations(locations);
        dispatch(updateLocations(locations));
      });

      newSocket.on("scan-complete", () => {
        setScanStatus("idle");
      });

      newSocket.on("go-to-location-complete", (data) => {
        console.log("go-to-location-complete", data);
        setGoToLocationStatus({
          type: data.type ? data.type : "",
          text: data.text ? data.text : "",
        });
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
          console.log("robot discovered", robotServices);
          robotServices.forEach((robot, index) => {
            setRobots((prevRobots) => [...prevRobots, robot]);
            if (index === robotServices.length - 1) {
              // If this is the last robot in the array, set the flag to indicate that the loop has finished
              setRobotDiscoveryFinished(true);
            }
          });
        });

        newSocket.on("robot-updated", (updatedRobot) => {
          setRobots((prevRobots) => {
            const updatedRobots = prevRobots.map((robot) => {
              if (robot.agv_id === updatedRobot.agv_id) {
                return { ...robot, ...updatedRobot };
              }
              return robot;
            });
            dispatch(updateRobots(updatedRobots));
            return updatedRobots;
          });
        });

        newSocket.on("locations-discovered", (locations) => {
          setLocations(locations);
          dispatch(updateLocations(locations));
        });

        newSocket.on("go-to-location-complete", (data) => {
          console.log("go-to-location-complete", data);
          setGoToLocationStatus({
            type: data.type ? data.type : "",
            text: data.text ? data.text : "",
            status: data.status ? data.status : "",
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

      setLocations([]);
      dispatch(updateLocations([]));

      setScanStatus("scanning");
      setSearching(true);
      socket.emit("start-scan");
      socket.emit("get-locations");
    }
  };

  const stopMdnsScan = () => {
    if (socket) {
      socket.emit("stop-scan");
      setSearching(false);
      setScanStatus("idle");
    }
  };

  const goToLocation = (robotIp, location) => {
    if (socket) {
      socket.emit("go-to-location", { robotIp, location });
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
    locations,
    goToLocation,
    goToLocationStatus,
    startMdnsScan,
    stopMdnsScan,
    searching,
    scanStatus,
    socketConnected,
    error,
  };
};

export default useRobots;
