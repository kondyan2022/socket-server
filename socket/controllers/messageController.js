const { Message, Room } = require("../../models");
const BaseController = require("./baseController");

module.exports = class MessageController extends BaseController {
  async messageSend({ message: text, roomId, operator = false }) {
    console.log("Message received:", text, roomId);
    let sock = this.socket.broadcast;
    sock = roomId ? sock.to(roomId) : sock;
    if (!roomId) {
      return;
    }
    const room = await Room.findOneAndUpdate(
      { roomId: roomId },
      {
        $push: { messages: { text, operator } },
        $inc: {
          unreadMessagesCount:
            !operator && !this.store.operatorOnline.has(roomId) ? 1 : 0,
        },
      },
      { new: true }
    );

    if (!room) {
      return;
    }

    // room.updateOne();
    // const message = await Message.create({
    //   room: room._id,
    //   text,
    //   operator,
    // });

    //   const { unreadMessagesCount } = await Room.findOneAndUpdate(
    //     { roomId: roomId },
    //     { $inc: { unreadMessagesCount: 1 } },
    //     { new: true }
    //   );
    if (!operator && !this.store.operatorOnline.has(roomId)) {
      this.socket.broadcast.emit("set-unread-message", {
        roomId,
        unreadMessagesCount: room.unreadMessagesCount,
      });
    }
    sock.emit("message-from-server", { message: text });
  }
};
