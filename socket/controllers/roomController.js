const BaseController = require("./baseController");

module.exports = class RoomController extends BaseController {
  joinRoom = ({ roomId }) => {
    this.socket.join(roomId);
    this.socket.broadcast.emit("new-room-created");
    console.log(`Join the room ${roomId}`);
  };
};
