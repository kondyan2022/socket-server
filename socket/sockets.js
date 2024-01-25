const {
  TypingController,
  RoomController,
  MessageController,
} = require("./controllers");

const sockets = (socket) => {
  const typingController = new TypingController(socket);
  const roomController = new RoomController(socket);
  const messageController = new MessageController(socket);
  console.log("Connection ready");
  socket.on(
    "message-send",
    messageController.messageSend.bind(messageController)
  );
  socket.on("start-typing", typingController.startTyping);
  socket.on("stop-typing", typingController.stopTyping);
  socket.on("join-room", roomController.joinRoom);
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
};

module.exports = sockets;
