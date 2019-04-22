// let avaliableId = 1000;

// //在线用户
// let onlineUsers = {};
// //当前在线人数
// let onlineUserCount = 0;

// const user = {
//   userId: 0,
//   userName: "",
//   login: function(socket, obj, callback) {
//     console.log("login: ", obj);
//     this.userId = avaliableId++;
//     this.userName = obj.userName;
//     socket.userId = this.userId;
//     socket.userName = this.userName;
//     onlineUsers.userId = this;
//     onlineUserCount++;

//     //登陆成功返回客户端
//     socket.emit("login_success", {
//       userId: socket.userId,
//       userName: socket.userName
//     });
//     callback();
//   },
//   disconnect: function(socket, callback) {
//     console.log("user disconnect:", socket.userId, socket.userName);
//     delete onlineUsers[socket.userId];
//     onlineUserCount--;
//     callback();
//   },
//   showAllUser: function() {
//     return onlineUsers;
//   }
// };
// module.exports = user;

let avaliableId = 10000;

// {
//   id: "",
//   userName: "",
//   userId: "",
//   status: 0 //0-连接 1-断开连接
// }
var onlineUser = {};

module.exports = (socket, data, cb) => {
  "use strict";
  console.log(new Date() + ">处理用户请求>", data);

  switch (data.type) {
    case "login":
      //处理老用户登录
      // if (!!data.userId) {
      //   cb({
      //     type: "login_success",
      //     userId: data.userId
      //   });
      //   onlineUser[data.userId].status = 0;
      // }
      //处理新用户登录
      if (!!data.userName) {
        var userId = avaliableId++;
        cb({
          type: "login_success",
          userId: userId,
          userName: data.userName
        });
        socket.userId = userId;
        socket.userName = data.userName;
        onlineUser[socket.id] = {
          id: socket.id,
          userName: data.userName,
          userId: data.userId,
          status: 0
        };
      }

      break;
    case "disconnect":
      //处理用户断开连接

      break;

    default:
      break;
  }
};
