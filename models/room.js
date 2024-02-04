const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    text: String,
    operator: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

const roomSchema = new Schema(
  {
    roomId: String,
    socketId: String,
    messages: [messageSchema],
    unreadMessagesCount: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

const Room = model("room", roomSchema);

module.exports = Room;
