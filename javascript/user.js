let avaliableId = 1000;

//在线用户
let onlineUsers = {};
//当前在线人数
let onlineUserCount = 0;

const user = {
  userId: 0,
  userName: "",
  login: function(socket, obj, callback) {
    console.log("login: ", obj);
    this.userId = avaliableId++;
    this.userName = obj.userName;
    socket.userId = this.userId;
    socket.userName = this.userName;
    onlineUsers.userId = this;
    onlineUserCount++;

    //登陆成功返回客户端
    socket.emit("login_success", {
      userId: socket.userId,
      userName: socket.userName
    });
    callback();
  },
  disconnect: function(socket, callback) {
    console.log("user disconnect:", socket.userId, socket.userName);
    delete onlineUsers[socket.userId];
    onlineUserCount--;
    callback();
  },
  showAllUser: function() {
    return onlineUsers;
  }
};
module.exports = user;
