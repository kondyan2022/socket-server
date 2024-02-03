const store = require("../utils/memoryStorage");
const {
  TypingController,
  RoomController,
  MessageController,
  ConnectionController,
} = require("./controllers");

const sockets = (socket) => {
  const typingController = new TypingController(socket, store);
  const roomController = new RoomController(socket, store);
  const messageController = new MessageController(socket, store);
  const connectionController = new ConnectionController(socket, store);

  console.log("Connection ready");
  socket.on(
    "message-send",
    messageController.messageSend.bind(messageController)
  );
  socket.on("start-typing", typingController.startTyping);
  socket.on("stop-typing", typingController.stopTyping);
  socket.on("join-room", roomController.joinRoom);
  socket.on("leave-room", roomController.leaveRoom);
  socket.on("new-room-created", roomController.newRoomCreated);
  socket.on("room-removed", roomController.roomRemoved);
  socket.on("upload", () => {});

  socket.on("disconnect", connectionController.disconnect);
};

module.exports = sockets;
