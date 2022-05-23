const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  joinedOn: {
    type: Date,
    default: Date.now,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
  },
});

module.exports = User = model("users", UserSchema);
