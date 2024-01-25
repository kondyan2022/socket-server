const express = require("express");

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const sockets = require("./socket/sockets");

require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", sockets);

httpServer.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
