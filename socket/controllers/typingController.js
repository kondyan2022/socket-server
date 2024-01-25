const BaseController = require("./baseController");

module.exports = class TypingController extends BaseController {
  startTyping = ({ roomId }) => {
    let sock = this.socket.broadcast;
    sock = roomId ? sock.to(roomId) : sock;
    sock.emit("start-typing-from-server");
  };

  stopTyping = ({ roomId }) => {
    let sock = this.socket.broadcast;
    sock = roomId ? sock.to(roomId) : sock;
    sock.emit("stop-typing-from-server");
  };
};
