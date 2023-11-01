const Chat = require("../Models/chat");
const Room = require("../Models/room");
const roomController = {};

roomController.getAllRooms = async () => {
  const roomList = await Room.find({});
  return roomList;
};

roomController.joinRoom = async (req, user) => {
  const room = await Room.findById(req.rid);
  if (!room) {
    throw new Error("해당 방이 없습니다.");
  }
  if (room.private && room.password !== req.password) {
    throw new Error("비밀번호가 다릅니다.");
  }
  //룸 멤버에 없으면 추가
  if (!room.members.includes(user._id)) {
    room.members.push(user._id);
    await room.save();
  }
  user.room = req.rid;
  await user.save();
};

roomController.leaveRoom = async (user) => {
  const room = await Room.findById(user.room);
  if (!room) {
    throw new Error("Room not found");
  }
  room.members.remove(user._id);
  await room.save();
};

roomController.checkChat = async (rid) => {
  const chatList = await Chat.find({ room: rid });
  // if (!user) throw new Error("user not found");
  return chatList;
};

module.exports = roomController;
