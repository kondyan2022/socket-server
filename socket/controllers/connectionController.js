const BaseController = require("./baseController");
const { Room } = require("../../models");

module.exports = class ConnectionController extends BaseController {
  disconnect = async () => {
    console.log("full disconnect");
    const room = await Room.findOne({ socketId: this.socket.id });
    console.log(room);
    if (!room) {
      this.store.operatorOnline.clear();
      this.socket.broadcast.emit("operator-leave-room");
    } else {
      this.store.userOnline.delete(room.roomId);
      this.socket.to(room.roomId).emit("user-leave-room", room.roomId);
      if (
        room?.messages.length === 0 &&
        !this.store.operatorOnline.has(room.roomId)
      ) {
        console.log("delete room ");
        await room.deleteOne();
        this.socket.broadcast.emit("refresh-rooms");
      }
    }
    this.socket.broadcast.emit("refresh-online", {
      operator: Array.from(this.store.operatorOnline),
      user: Array.from(this.store.userOnline),
    });
    console.log(room, "<=============");
    console.log("User disconnected");
  };
};
