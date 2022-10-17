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
const { db } = require("./models/Users");

mongoose
  .connect("mongodb://localhost:44444/authentication")
  .then(() => {
    console.log("DB connected");
    // create a user a new user
    /*     var testUser = new User({
      username: "Rigby",
      password: "pass",
    });

    // save the user to database
    testUser.save(function (err) {
      if (err) throw err;
    }); */
    //Sockets.io
    const port = 3333;
    const server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    const { Server } = require("socket.io");
    const io = new Server(server);

    app.use(express.static("public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/public/html/create-account.html");
    });
    app.post("/validate-and-create-account", (req, res) => {
      let user = User.findOne(
        { username: req.body.username_field },
        function (err, result) {
          if (err) {
            console.log(err);
          } else if (!result) {
            var new_user = new User({
              username: req.body.username_field,
              password: req.body.password_field,
            });
            console.log(new_user);
            // save the user to database
            new_user.save(function (err) {
              if (err) throw err;
            });
            console.log(result);
          } else {
            console.log(result);
          }
        }
      );

      res.send(
        `username ${req.body.username_field} password ${req.body.password_field}`
      );
    });

    app.get("/sign-in", (req, res) => {
      res.sendFile(__dirname + "/public/html/sign-in.html");
    });
    app.get("/handle-sign-in", (req, res) => {
      res.sendFile(__dirname + "/public/html/sign-in.html");
    });
    /* app.get("/", (req, res) => {
      res.sendFile(__dirname + "/public/html/index.html");
    }); */

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
