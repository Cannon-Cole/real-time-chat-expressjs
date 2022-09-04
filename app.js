//ExpressJS
const express = require("express");
const app = express();

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
