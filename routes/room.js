const { Router } = require("express");
const { Room } = require("../models");
const store = require("../utils/memoryStorage");

const router = new Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find().select(["-messages"]);
  rooms.userOnline = Array.from(store.userOnline);
  rooms.operatorOnline = Array.from(store.operatorOnline);
  res.json({ rooms });
});

router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  // const roomList = await Room.aggregate([
  //   { $match: { roomId } },
  //   {
  //     $lookup: {
  //       from: "messages",
  //       localField: "_id",
  //       foreignField: "room",
  //       as: "messages",
  //     },
  //   },
  // ]);
  // const room = roomList[0];
  const room = await Room.findOne({ roomId });

  res.json({
    room: room ? room : { messages: [] },
    isUserOnline: store.userOnline.has(roomId),
    isOperatorOnline: store.operatorOnline.has(roomId),
  });
});

module.exports = router;
