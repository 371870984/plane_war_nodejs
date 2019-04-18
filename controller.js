var User = require("./javascript/user");
var Room = require("./javascript/room");
module.exports = function(port) {
  var io = require("socket.io")(port || 3000);

  io.on("connection", socket => {
    console.log("new user connected!");
    //用户登录
    socket.on("login", obj => {
      User.login(socket, obj, function() {
        //登陆成功广播
        socket.broadcast.emit("new user login", {
          userId: socket.userId,
          userName: socket.userName
        });
      });
    });
    //创建房间
    socket.on("create_room", obj => {
      console.log("create room", socket.userId);
      try {
        Room.createRoom(socket, obj.roomName, () => {
          //创建房间成功
          console.log("创建房间成功回调");
        });
      } catch (error) {
        console.log("创建房间失败回调", error);
      }
    });
    //加入房间
    socket.on("join_room", obj => {
      console.log("join room: ", socket.userId, obj);
      Room.joinRoom(socket, obj.roomId, () => {
        io.to(obj.roomId).emit("other_joined_room", {
          userId: socket.userId,
          userName: socket.userName
        }); // broadcast to everyone in the room
      });
    });
    //获取房间列表
    socket.on("get_room_list", obj => {
      Room.getRoomList(socket, () => {
        console.log("房间列表获取成功");
      });
    });
    //获取房间信息
    socket.on("get_room_userList", obj => {
      Room.getRoomUserList(socket, obj.roomId, () => {
        console.log(obj.roomId, "房间信息获取成功");
      });
    });
    //离开房间
    socket.on("leave_room", () => {
      console.log("leave room: ", socket.userId, obj);
      Room.leaveRoom(socket, () => {
        console.log("离开房间成功");
        io.to(socket.roomId).emit("leave_room_success", socket.userId); // broadcast to everyone in the room
      });
    });

    //用户断开
    socket.on("disconnect", reason => {
      console.log("user disconnect: ", socket, reason);
      //如果在房间内，房间断开连接
      if (!!socket.roomId) {
        Room.leaveRoom(socket, socket.roomId, () => {
          console.log("离开房间成功");
          io.to(socket.roomId).emit("leave_room_success", socket.userId); // broadcast to everyone in the room
        });
      }
      User.disconnect(socket, function() {
        console.log("用户断开成功");
        io.emit("other_disconnect", {
          userId: socket.userId,
          userName: socket.userName
        });
      });
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
};
