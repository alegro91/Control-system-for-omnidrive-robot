const express = require("express");
const { spawn } = require("child_process");
const mdns = require("mdns-js");
const dns = require("dns");
const ping = require("ping");
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

    // Use the 'arp' command to find devices on the LAN
    const arp = spawn("arp", ["-a"]);

    arp.stdout.on("data", (data) => {
      const output = data.toString().split("\n");

      output.forEach((line) => {
        if (line.includes("incomplete") || !line.includes("ether")) {
          return;
        }
        const parts = line.split(" ");
        const ip = parts[1].replace("(", "").replace(")", "");
        const mac = parts[3].toUpperCase();
        hosts.push({ ip, mac });
        console.log("Found device:", ip, mac);
      });
    });

    arp.on("close", () => {
      console.log("ARP scan complete");
    });

    // Use the 'ping' module to check if devices are online
    const subnet = clientIp.split(".").slice(0, 3).join(".");
    const promises = [];

    for (let i = 1; i < 255; i++) {
      const ip = subnet + "." + i;
      promises.push(
        new Promise(async (resolve) => {
          ping.sys.probe(ip, async (isAlive) => {
            if (isAlive) {
              console.log("Device online:", ip);
              const host = await resolveHostnameAndFilter(ip);
              if (host) {
                hosts.push(host);
              }
            }
            resolve();
          });
        })
      );
    }

    // Use the 'dns' module to resolve hostnames
    dns.reverse(clientIp, (err, hostnames) => {
      if (err) {
        console.error("Error resolving hostname:", err);
        return;
      }
      console.log("Hostname:", hostnames[0]);
      hosts.push({ name: hostnames[0] });
    });

    // Use the 'mdns' module to discover devices via mDNS
    const browser = mdns.createBrowser(mdns.tcp("http"));

    browser.on("ready", () => {
      browser.discover();
    });

    browser.on("update", (data) => {
      if (data.host === undefined) return;
      if (hosts.some((host) => host.ip === data.addresses[0])) return;
      hosts.push({ ip: data.addresses[0], name: data.host });
      console.log("Found device via mDNS:", data.host, data.addresses[0]);
    });

    // Stop scan after 10 seconds
    scanTimeout = setTimeout(async () => {
      console.log("Stopping LAN scan...");

      await Promise.all(promises);
      socket.emit("scan-complete", hosts);
      console.log(hosts);
      browser.stop();
    }, 10000);
  });

  socket.on("stop-scan", () => {
    console.log("Stopping scan...");
    clearTimeout(scanTimeout);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
