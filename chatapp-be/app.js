const express = require("express");
const app = express();
const mongoose = require("mongoose");

//express는 .env 사용하려면 dotenv 가져와야함
require("dotenv").config();
const cors = require("cors");
app.use(cors());
//디비 연결
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

module.exports = app;
