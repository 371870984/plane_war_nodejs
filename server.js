"use strict";
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var user = require("./javascript/user");
console.log(user);

app.get("/", function(req, res) {
  res.send("<h1>Welcome Realtime Server</h1>");
});

io.on("connection", socket => {
  console.log("new user connected!");
  //用户登录
  socket.on("login", obj => {
    user.login(socket, obj, function(_this) {
      console.log("user obj", _this);
      io.emit("new user login", {
        userId: _this.userId,
        userName: _this.userName
      });
    });
  });
  //加入房间
  socket.on("join room", obj => {
    console.log("join room: ", socket.userId, obj);
    socket.join(socket.userId <= 1003 ? "room 01" : "room 02", () => {
      let rooms = Object.keys(socket.rooms);
      console.log(rooms); // [ <socket.id>, 'room 237' ]
      io.to("room 01").emit("a new user has joined the room", obj); // broadcast to everyone in the room
    });
  });

  //用户断开
  socket.on("disconnect", reason => {
    console.log("disconnect: ", socket.userId, reason);
  });
  socket.on("reconnect", attempt => {
    console.log("reconnect: ", socket.userId, attempt);
  });
  socket.on("message", obj => {});
  //连接错误
  socket.on("error", error => {
    console.log("error: ", socket.userId, error);
  });
});

http.listen(3000, function() {
  console.log("listening on:3000");
});
