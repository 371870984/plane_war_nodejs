var avaliableRoomId = 1000;
//创建的房间
var onlineRooms = {};

var onlineRoomsCount = 0;

function Room() {
  var _this = this;
  this.roomId = 1000; //房间ID
  this.roomName = ""; //房间名称
  this.maxCount = 8; //房间最大人数
  this.currentCount = 0; //房间当前人数
  this.users = []; //房间里用户的
  this.roomObj = {};

  //创建新房间
  this.createRoom = (socket, roomName, callback) => {
    _this.roomId = avaliableRoomId++;
    _this.roomName = roomName;
    _this.currentCount++;
    socket.roomId = _this.roomId;
    _this.roomObj = {
      roomId: _this.roomId,
      roomName: _this.roomName,
      maxCount: _this.maxCount,
      currentCount: _this.currentCount,
      userList: _this.users
    };
    onlineRooms[_this.roomId] = _this.roomObj;

    socket.emit("create_room_success", { roomId: _this.roomId });
    _this.joinRoom(socket, _this.roomId, () => {
      callback();
    });
  };
  //加入房间
  this.joinRoom = function(socket, roomId, callback) {
    if (this.currentCount >= this.maxCount) {
      throw new Error("房间人数已满！");
    } else {
      socket.join(roomId, () => {
        socket.roomId = _this.roomId;
        let rooms = Object.keys(socket.rooms);
        console.log("join room success", rooms); // [ <socket.id>, 'room 237' ]
        _this.currentCount++;
        this.users.push({
          userId: socket.userId,
          userName: socket.userName
        });
        console.log(onlineRooms);
        socket.emit("join_room_success", {
          roomId: _this.roomId,
          roomName: _this.roomName
        });
        callback();
      });
    }
  };
  //获取房间列表
  this.getRoomList = function(socket, callback) {
    socket.emit("get_room_list_success", {
      roomList: onlineRooms
    });
    callback();
  };
  //获取房间内用户列表
  this.getRoomUserList = function(socket, roomId, callback) {
    socket.emit("get_room_userList_success", {
      roomId: roomId,
      userList: onlineRooms[roomId].userList
    });
    callback();
  };
  //离开房间
  this.leaveRoom = function(socket, callback) {
    var roomId = socket.roomId
    socket.leave(roomId, () => {
      _this.currentCount--; //房间人数减一
      //遍历房间用户列表删除用户
      console.log("离开房间的socket id", socket.userId);
      console.log(onlineRooms[roomId]);
      for (var i = 0; i < onlineRooms[roomId].userList.length; i++) {
        if (onlineRooms[roomId].userList[i].userId == socket.userId) {
          onlineRooms[roomId].userList.splice(i, 1);
          console.log(onlineRooms[roomId].userList);
        }
      }
      //玩家全部离开后销毁房间
      if (this.currentCount <= 0) {
        delete onlineRooms[roomId];
      }

      //删除socket上绑定的roomId roomName
      delete socket.roomId;
      delete socket.roomName;
      socket.emit("leave_room_success");
      callback();
    });
  };
}
module.exports = (function() {
  return new Room();
})();
