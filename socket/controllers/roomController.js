const { Room } = require("../../models");
const BaseController = require("./baseController");

module.exports = class RoomController extends BaseController {
  joinRoom = ({ roomId }) => {
    this.socket.join(roomId);
    console.log(`Join the room ${roomId}`);
  };
  newRoomCreated = async ({ roomId }) => {
    this.socket.broadcast.emit("new-room-created", { roomId });
    const room = await Room.create({ name: "test", id: roomId });
  };
};
