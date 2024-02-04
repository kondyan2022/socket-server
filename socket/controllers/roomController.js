const { trusted } = require("mongoose");
const { Room, Message } = require("../../models");
const BaseController = require("./baseController");

module.exports = class RoomController extends BaseController {
  joinRoom = async ({ roomId, operator }) => {
    if (operator) {
      const rooms = Array.from(this.socket.rooms);
      rooms.forEach(async (elem) => {
        if (elem !== this.socket.id) {
          await this.leaveRoom({ roomId: elem, operator });
          // this.store.operatorOnline.delete(elem);
          // this.socket.broadcast
          //   .to(elem)
          //   .emit("operator-leave-room", { roomId });
          // console.log(elem, "operator leave room");
          // this.socket.leave(elem);
        }
      });
    }

    this.socket.join(roomId);
    if (operator) {
      this.store.operatorOnline.add(roomId);

      this.socket.broadcast.to(roomId).emit("operator-join-room", { roomId });
    } else {
      this.store.userOnline.add(roomId);
      this.socket.broadcast.emit("user-join-room", { roomId });
    }
    console.log(`${operator ? "Operator" : "Guest"} joined the room ${roomId}`);
    // this.socket.rooms.forEach((elem) => {
    //   if (elem !== this.socket.id) {
    //     console.log(elem);
    //   }
    // });
    console.log(this.store.operatorOnline, "store operator online");
    console.log(this.store.userOnline, "store user online");
    let room = await Room.findOne({ roomId });
    if (!room) {
      room = await Room.create({ roomId, socketId: this.socket.id });
      this.socket.broadcast.emit("refresh-rooms");
    }

    if (operator && room.unreadMessagesCount) {
      room.updateOne({ unreadMessagesCount: 0 }).exec();
      this.socket.broadcast.emit("set-unread-message", {
        roomId,
        unreadMessagesCount: 0,
      });
    }

    this.socket.broadcast.emit("refresh-online", {
      operator: Array.from(this.store.operatorOnline),
      user: Array.from(this.store.userOnline),
    });
  };

  leaveRoom = async ({ roomId, operator }) => {
    if (operator) {
      this.store.operatorOnline.delete(roomId);
      this.socket.broadcast.to(roomId).emit("operator-leave-room", { roomId });
    } else {
      this.store.userOnLine.delete(roomId);
      this.socket.broadcast.to(roomId).emit("user-leave-room", { roomId });
    }
    this.socket.leave(roomId);
    console.log(`${operator ? "Operator" : "User"} left the room ${roomId}`);
    if (
      !this.store.userOnline.has(roomId) &&
      !this.store.operatorOnline.has(roomId)
    ) {
      const room = await Room.findOne({ roomId });
      if (room?.messages.length === 0) {
        console.log("delete room ");
        await room.deleteOne();
        this.socket.broadcast.emit("refresh-rooms");
      }
    }
  };

  newRoomCreated = async ({ roomId }) => {
    const room = await Room.create({ name: "test", roomId });
    this.socket.broadcast.emit("new-room-created", room);
  };

  roomRemoved = async ({ roomId }) => {
    this.socket.leave(roomId);
    this.socket.emit("room-removed", { roomId });
    this.socket.broadcast.emit("room-removed", { roomId });
    const room = await Room.findOneAndDelete({ roomId });
  };
};
