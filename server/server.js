const express = require("express");
const mdns = require("multicast-dns")();
const http = require("http");
const cors = require("cors");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
app.use(cors());

// Add WebSocket support
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Change this to the correct origin for the React app
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected");

  // Client requests to start mDNS scan
  socket.on("start-mdns-scan", () => {
    console.log("Starting mDNS scan...");
    mdns.query({
      questions: [
        {
          name: "_your-robot-service._tcp.local", // Replace with your service name (e.g. _http._tcp.local)
          type: "PTR", // PTR is the type for mDNS service discovery
        },
      ],
    });
  });

  socket.on("stop-mdns-scan", () => {
    console.log("Stopping mDNS scan...");
    mdns.removeAllListeners("response");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

mdns.on("response", (response) => {
  const robotServices = response.answers.filter(
    (answer) => answer.name === "_your-robot-service._tcp.local"
  );

  if (robotServices.length > 0) {
    io.emit("robot-discovered", robotServices);
    io.emit("scan-complete");
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
