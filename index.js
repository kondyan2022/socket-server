const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const sockets = require("./socket/sockets");
const mongoose = require("mongoose");
const { roomRouter } = require("./routes");
require("dotenv").config();

const app = express();
app.use(logger("tiny"));
app.use(cors());

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use("/rooms", roomRouter);

// app.use((req, res) => {
//   res.status(404).json({ message: "Not found" });
// });

// app.use((err, req, res, next) => {
//   const { status = 500, message = "Server error" } = err;
//   res.status(status).json({ message });
// });
io.on("connection", sockets);

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    httpServer.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
