var handleUser = require("./javascript/user");
var handleRoom = require("./javascript/room");

module.exports = function(port) {
  "use strict";
  var io = require("socket.io")(port || 3000);

  io.on("connection", socket => {
    console.log(new Date() + ">用户连接到服务器>", socket);
    //处理用户连接
    socket.on("user", data => {
      handleUser(socket, data, cbData => {
        //返回数据给客户端
        socket.emit("user", cbData);
        //广播
        socket.broadcast.emit("user", {
          type: "new_user_login",
          userId: cbData.userId,
          userName: cbData.userName
        });
      });
    });
    //处理房间
    socket.on("room", data => {
      handleRoom(socket, data, cbData => {
        //返回数据给客户端
        socket.emit("room", cbData);
      });
    });

    //用户断开连接
    socket.on("disconnect", reason => {
      //如果用户在房间里
      if (!!socket.roomId) {
        handleRoom(
          socket,
          { type: "leave_room", roomId: socket.roomId },
          cbData => {}
        );
      }
    });
  });
};
