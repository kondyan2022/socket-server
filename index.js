const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => console.log("Connection ready"));
httpServer.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
