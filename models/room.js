const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  roomId: String,
  socketId: String,
  guestOnline: { type: Boolean, default: false },
  operatorOnline: { type: Boolean, default: false },
});

const Room = model("room", roomSchema);

module.exports = Room;
