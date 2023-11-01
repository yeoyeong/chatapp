const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room: String,
    private: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: function () {
        return this.private; // private 필드가 true일 때만 password 필드가 필요합니다.
      },
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        unique: true,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Room", roomSchema);
