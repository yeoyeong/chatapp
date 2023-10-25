// const { default: socket } = require("../../chatapp-fe/src/server");
// const { on } = require("../Models/user");
const userController = require("../Controllers/user.controller");

module.exports = function (io) {
  //on() 듣기
  io.on("connection", async (socket) => {
    console.log("client is connected", socket.id);

    socket.on("login", async (userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, data: error.message });
      }
    });
  });
};
