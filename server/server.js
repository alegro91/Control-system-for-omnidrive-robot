const express = require("express");
const { spawn } = require("child_process");
const mdns = require("mdns-js");
const dns = require("dns");
const ping = require("ping");
const http = require("http");
const fetch = require("node-fetch");
const EventEmitter = require("events");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const emitter = new EventEmitter();

let discoveredRobots = [];

/* CONSTS */
const ROBOT_PORT = "7012";
const ROBOT_COMMAND = "rpc/get_agv_data";
const MAC_PREFIX = "0:E:8E";

const getClientIp = (socket) => {
  const ipAddress = socket.handshake.address;
  if (ipAddress.substr(0, 7) === "::ffff:") {
    return ipAddress.substr(7);
  }
  return ipAddress;
};

const fetchRobotData = async (ip) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: "POST",
    };

    fetch(`http://${ip}:${ROBOT_PORT}/${ROBOT_COMMAND}`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson.Result);
      })
      .catch((error) => {
        console.log(`No robot data found for IP: ${ip}`);
        resolve(null);
      });
  });
};

const fetchLocations = async (ip) => {
  const P_COMMAND = "rpc/list_locations";
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: "POST",
    };

    fetch(`http://${ip}:${ROBOT_PORT}/${P_COMMAND}`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        // Extract the names from the response
        const result = responseJson.Result;
        const names = Object.keys(result);

        resolve(names);
      })
      .catch((error) => {
        console.log(`No locations data found for: ${ip}`);
        resolve(null);
      });
  });
};

const resolveHostnameAndFilter = async (ip) => {
  return new Promise((resolve, reject) => {
    dns.reverse(ip, (err, hostnames) => {
      if (err) {
        console.error("Error resolving hostname:", err);
        resolve(null);
        return;
      }
      const hostname = hostnames[0];
      if (hostname.startsWith("solwr")) {
        resolve({ ip, name: hostname });
      } else {
        resolve(null);
      }
    });
  });
};

// Add WebSocket support
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Change this to the correct origin for the React app
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const clientIp = getClientIp(socket);
  console.log("Client connected : " + clientIp);

  let scanTimeout = null;

  // Client requests to start LAN scan
  socket.on("start-scan", async () => {
    console.log("Received start-lan-scan event");
    console.log("Starting LAN scan : " + clientIp);

    const hosts = [];
    const locations = [];

    // Use the 'arp' command to find devices on the LAN
    const arp = spawn("arp", ["-a"]);

    let fetchingDataCompleted = false;

    arp.stdout.on("data", async (data) => {
      const output = data.toString().split("\n");
      let robotCount = 1;
      /* Test purposes only */
      //
      /*
      output.map(async (line) => {
        const parts = line.split(" ");
        if (parts.length < 4) {
          return;
        }
        const ip = parts[1].replace("(", "").replace(")", "");
        const mac = parts[3].toUpperCase();

        if (ip !== "") {
          hosts.push({ ip, mac });
        }
      });
      */
      //

      const fetchPromises = output.map(async (line) => {
        if (line.includes("incomplete") || !line.includes("ether")) {
          return;
        }
        const parts = line.split(" ");
        if (parts.length < 4) {
          return;
        }
        const ip = parts[1].replace("(", "").replace(")", "");
        const mac = parts[3].toUpperCase();
        console.log("Found device:", ip, mac);
        if (mac.startsWith(MAC_PREFIX)) {
          const robotData = await fetchRobotData(ip);
          if (robotData) {
            robotData.ip = ip;
            robotData.mac = mac;
            hosts.push(robotData);
            if (locations.length === 0) {
              // Fetch locations for the first robot only
              const locationsData = await fetchLocations(ip);
              if (locationsData) {
                locations.push(locationsData);
                console.log("Locations discovered:", locationsData);
              }
            }
          }
        }
      });

      await Promise.all(fetchPromises);
      fetchingDataCompleted = true;
    });

    arp.on("close", () => {
      const waitForDataFetching = setInterval(() => {
        if (fetchingDataCompleted) {
          console.log("ARP scan complete");
          clearInterval(waitForDataFetching);
        }
      }, 500);
    });

    // Stop scan after 10 seconds
    scanTimeout = setTimeout(async () => {
      console.log("Stopping LAN scan...");

      socket.emit("scan-complete");

      discoveredRobots = hosts;
      // Emit the 'robot-discovered' event with the discovered robots
      socket.emit("robot-discovered", hosts);

      console.log("Robots discovered", hosts);

      if (locations.length > 0) {
        // Emit the 'locations-discovered' event with the locations of the first robot
        socket.emit("locations-discovered", locations);
        console.log("Locations emitted", locations[0]);
      }
    }, 10000);
  });

  // Check for updates in the discovered robots
  /*
  setInterval(async () => {
    const updatedRobots = await Promise.all(
      discoveredRobots.map(async (robot) => {
        console.log("Checking for updates in", robot);
        return fetchRobotData(robot.ip);
      })
    );
    for (let i = 0; i < updatedRobots.length; i++) {
      if (
        JSON.stringify(updatedRobots[i]) !== JSON.stringify(discoveredRobots[i])
      ) {
        // If different, emit a 'robot-updated' event with the new data
        io.emit("robot-updated", updatedRobots[i]);
        console.log("Robot updated", updatedRobots[i]);
        // Update the robot in the discoveredRobots array
        discoveredRobots[i] = updatedRobots[i];
      }
    }
  }, 5000); // Check for updates every 5 seconds
  */

  socket.on("stop-scan", () => {
    console.log("Stopping scan...");
    clearTimeout(scanTimeout);
  });

  socket.on("go-to-location", (data) => {
    console.log(data);
    const ip = data.robotIp;
    const location = data.location;
    console.log("Received go-to-location event");
    console.log("Going to location : " + location + " : " + ip);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([[location], {}]),
    };

    fetch(`http://${ip}:7012/rpc/go_to_location`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        socket.emit("go-to-location-complete", {
          type: "success",
          text: "Go to location complete",
          status: result.status,
        });
      })
      .catch((error) => {
        socket.emit("go-to-location-complete", {
          type: "error",
          text: error.message,
        });
        console.log(error);
      });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
module.exports.getClientIp = getClientIp;
