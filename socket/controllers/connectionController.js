const BaseController = require("./baseController");
const { Room } = require("../../models");

module.exports = class ConnectionController extends BaseController {
  disconnect = async () => {
    console.log(this.socket.rooms, "full disconect");
    const room = await Room.findOne(
      { socketId: this.socket.id }
      //   { guestOnline: false }
    );
    if (!room) {
      this.socket.emit("operator-leave-room");
      this.store.operatorOnline.clear();

      //   await Room.updateMany(
      //     { operatorOnline: true },
      //     { operatorOnline: false }
      //   );
    } else {
      this.store.userOnline.delete(room.roomId);
      this.socket.to(room.roomId).emit("user-leave-room", room.roomId);
    }
    this.socket.broadcast.emit("refresh-online", {
      operator: Array.from(this.store.operatorOnline),
      user: Array.from(this.store.userOnline),
    });
    console.log(room, "<=============");
    console.log("User disconnected");
  };
};
