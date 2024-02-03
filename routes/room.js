const { Router } = require("express");
const { Room } = require("../models");

const router = new Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json({ rooms });
});

module.exports = router;
