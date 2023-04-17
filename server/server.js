const express = require("express");
const mdns = require("multicast-dns")();
const http = require("http");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

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
  console.log("Client connected");

  let scanTimeout = null;

  // Client requests to start mDNS scan
  socket.on("start-mdns-scan", () => {
    console.log("Received start-mdns-scan event");
    console.log("Starting mDNS scan...");

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

    console.log("Scan started");

    // Set a timer for 5 seconds
    setTimeout(() => {
      console.log("Scan complete");
      mdns.removeAllListeners("response");
      io.emit("scan-complete");
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
});

mdns.on("response", (response) => {
  const robotServices = response.answers.filter(
    (answer) => answer.name === "_my-robot-service._tcp.local"
  );

  if (robotServices.length > 0) {
    io.emit("robot-discovered", robotServices);
    clearTimeout(scanTimeout);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
