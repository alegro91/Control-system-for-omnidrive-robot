const express = require("express");
const mdns = require("multicast-dns")();
const http = require("http");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Add WebSocket support
const io = require("socket.io")(server);
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
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
