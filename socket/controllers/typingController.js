const BaseController = require("./baseController");

module.exports = class TypingController extends BaseController {
  startTyping = ({ roomId, operator = false }) => {
    let sock = this.socket.broadcast;
    sock = roomId ? sock.to(roomId) : sock;
    sock.emit("start-typing-from-server");
    this.store.typing.add(roomId);
    if (!operator) {
      this.socket.broadcast.emit(
        "refresh-typing",
        Array.from(this.store.typing)
      );
    }
  };

  stopTyping = ({ roomId, operator = false }) => {
    let sock = this.socket.broadcast;
    sock = roomId ? sock.to(roomId) : sock;
    sock.emit("stop-typing-from-server");
    this.store.typing.delete(roomId);
    if (!operator) {
      this.socket.broadcast.emit(
        "refresh-typing",
        Array.from(this.store.typing)
      );
    }
  };
};
