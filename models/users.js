const mongoose = require("mongoose");

module.exports = mongoose.model(
  "users",
  new mongoose.Schema({
    user: String,
    pets: Array,
    coins: Number,
    lvl: Number,
    info: Object,
  })
);
