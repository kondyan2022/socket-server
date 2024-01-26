const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  name: String,
  id: String,
});

const Room = model("room", roomSchema);

module.exports = Room;
