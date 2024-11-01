const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  userid: { type: String },
  username: { type: String, required: true },
  avatar:{ type: String}
});

const User = mongoose.model("user", userSchema);

module.exports = User;
