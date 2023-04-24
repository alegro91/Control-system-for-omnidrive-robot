const express = require("express");
const mdns = require("multicast-dns")();
const http = require("http");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const getClientIp = (socket) => {
  const ipAddress = socket.handshake.address;
  if (ipAddress.substr(0, 7) === "::ffff:") {
    return ipAddress.substr(7);
  }
  return ipAddress;
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

  // Client requests to start mDNS scan
  socket.on("start-mdns-scan", () => {
    console.log("Received start-mdns-scan event");
    console.log("Starting mDNS scan : " + clientIp);

    try {
      mdns.query({
        questions: [
          {
            name: "_my-robot-service._tcp.local",
            type: "PTR",
          },
        ],
      });
    } catch (error) {
      console.error("Error in mdns.query():", error);
    }
    // Set a timer for 5 seconds
    setTimeout(() => {
      console.log("Scan complete : " + clientIp);
      mdns.removeAllListeners("response");
      socket.emit("scan-complete");
    }, 5000);
  });

  socket.on("stop-mdns-scan", () => {
    console.log("Stopping mDNS scan...");
    mdns.removeAllListeners("response");
    clearTimeout(scanTimeout);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  mdns.on("response", (response) => {
    console.log("Received mDNS response");
    const robotServices = response.answers.filter(
      (answer) => answer.name === "_my-robot-service._tcp.local"
    );

    if (robotServices.length > 0) {
      socket.emit("robot-discovered", robotServices);
      clearTimeout(scanTimeout);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
