const BaseController = require("./baseController");

module.exports = class MessageController extends BaseController {
  messageSend({ message, roomId }) {
    console.log("Message received:", message, roomId);
    let sock = this.socket.broadcast;
    sock = roomId ? sock.to(roomId) : sock;
    sock.emit("message-from-server", { message });
  }
};
