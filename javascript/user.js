var avaliableId = 1000;

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

var user = {
  userId: 0,
  userName: "",
  login: function(socket, obj, fn) {
    console.log("login: ", obj);
    this.userId = avaliableId++;
    this.userName = obj.userName;
    socket.userId = this.userId;
    socket.userName = this.userName;
    onlineUsers.userId = this;
    onlineCount++;

    //登陆成功返回客户端
    socket.emit("login success", {
      userId: socket.userId,
      userName: socket.userName
    });
    fn(this);
  },
  showAllUser: function() {
    return onlineUsers;
  }
};
module.exports = user;
