//ExpressJS
const express = require("express");
const app = express();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
//var db = require("../db");
var logger = require("morgan");
var passport = require("passport");
var session = require("express-session");
const mongoose = require("mongoose");
const User = require("./models/Users");

mongoose
  .connect("mongodb://localhost:44444/authentication")
  .then(() => {
    console.log("DB connected");
    // create a user a new user
    var testUser = new User({
      username: "Rigby",
      password: "pass",
    });

    // save the user to database
    testUser.save(function (err) {
      if (err) throw err;
    });
    //Sockets.io
    const port = 3333;
    const server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    const { Server } = require("socket.io");
    const io = new Server(server);

    let rooms = {};

    app.use(express.static("public"));

    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/public/index.html");
    });

    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.broadcast.emit("chat message", socket.id + " connected");
      socket.on("disconnect", () => {
        console.log("user disconnected");
        socket.broadcast.emit("chat message", socket.id + " disconnected");
      });
      socket.on("chat message", (msg) => {
        console.log("message: " + msg);
        socket.broadcast.emit("chat message", msg);
      });
    });
  })
  .catch(() => {
    console.log("DB connection failed");
  });
