const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//express는 .env 사용하려면 dotenv 가져와야함
require("dotenv").config();
const cors = require("cors");
const Room = require("./Models/room");

app.use(cors());
app.use(bodyParser.json()); // body-parser 미들웨어 추가

//디비 연결
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

// //  임의로 룸을 만들어주기
// app.get("/", async (req, res) => {
//   Room.insertMany([
//     {
//       room: "자바스크립트 단톡방",
//       members: [],
//     },
//     {
//       room: "리액트 단톡방",
//       members: [],
//     },
//     {
//       room: "NodeJS 단톡방",
//       members: [],
//     },
//   ])
//     .then(() => res.send("ok"))
//     .catch((error) => res.send(error));
// });
// 새로운 룸을 만드는 API
app.post("/make_room", async (req, res) => {
  const newRoom = new Room({
    room: req.body.room,
    private: req.body.private,
    members: [],
  });
  if (req.body.private) {
    console.log(req.body.password);
    newRoom.password = req.body.password;
  }
  // newRoom.concat({ password: req.body.password });
  newRoom
    .save()
    .then(() => res.send({ ok: true }))
    .catch((error) => res.send(error));
});

// app.post("/private_join", async (req, res) => {
//   const newRoom = new Room({
//     room: req.body.room,
//     private: req.body.private,
//     members: [],
//   });
//   if (req.body.private) {
//     console.log(req.body.password);
//     newRoom.password = req.body.password;
//   }
//   // newRoom.concat({ password: req.body.password });
//   newRoom
//     .save()
//     .then(() => res.send({ ok: true }))
//     .catch((error) => res.send(error));
// });

module.exports = app;
