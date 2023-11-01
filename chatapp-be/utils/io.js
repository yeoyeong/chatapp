// const { default: socket } = require("../../chatapp-fe/src/server");
// const { on } = require("../Models/user");
const chatController = require("../Controllers/chat.controller");
const roomController = require("../Controllers/room.controller");
const userController = require("../Controllers/user.controller");

module.exports = function (io) {
  //on() 듣기
  io.on("connection", async (socket) => {
    console.log("client is connected", socket.id);

    socket.on("login", async (userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);
        // const welcomeMessage = {
        //   chat: `${user.name} is join`,
        //   user: { id: null, name: "system" },
        // };
        // io.emit("message", welcomeMessage);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, data: error.message });
      }
    });

    // socket.on("sendMessage", async (message, cb) => {
    //   try {
    //     const user = await userController.checkUser(socket.id);
    //     const newMessage = await chatController.saveChat(message, user);
    //     io.emit("message", newMessage);
    //     cb({ ok: true });
    //   } catch (error) {
    //     // cb({ ok: false, data: error.message });
    //   }
    // });
    socket.on("sendMessage", async (receivedMessage, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        if (user) {
          const message = await chatController.saveChat(receivedMessage, user);
          io.to(user.room.toString()).emit("message", message);
          return cb({ ok: true });
        }
        cb({ ok: true });
      } catch (error) {
        // cb({ ok: false, data: error.message });
      }
    });

    socket.emit("rooms", await roomController.getAllRooms());

    socket.on("joinRoom", async (req, cb) => {
      try {
        const user = await userController.checkUser(socket.id); // 일단 유저정보들고오기
        console.log("룸", user);
        await roomController.joinRoom(req, user); // 유저.room에 방id 넣기
        socket.join(user.room.toString()); //유저.roomid에 접속

        const chatList = await roomController.checkChat(user.room.toString());
        const welcomeMessage = {
          chat: `${user.name} is joined to this room`,
          user: { id: null, name: "system" },
        };
        io.to(user.room.toString()).emit("message", welcomeMessage); // 시스템메세지
        io.emit("rooms", await roomController.getAllRooms()); // 방 인원 업데이트 알림
        cb({ ok: true, chatList });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    //채팅방나가기
    socket.on("leaveRoom", async (_, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        await roomController.leaveRoom(user);
        const leaveMessage = {
          chat: `${user.name} left this room`,
          user: { id: null, name: "system" },
        };
        socket.broadcast.to(user.room.toString()).emit("message", leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다
        io.emit("rooms", await roomController.getAllRooms());
        socket.leave(user.room.toString()); // join했던 방을 떠남
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, message: error.message });
      }
    });
  });
};

// emit 모두에게
// join 일부에게 방 목록 등등
// socket.join(user.room.toString());
//의 의미는 이 소켓은 유저가 들어있는 방의 id를 이름으로 사용하는 어떤 그룹으로 들어가겠다는 이야기다

//io.to(user.room.toString()).emit("message", welcomeMessage);
//이 코드를 통해 프라이베잇하게 대화할 수 있다.
//이 룸id에들어있는 사람들 에게(to) 말한다 (emit) 이 메세지를 (welcomeMessages)
