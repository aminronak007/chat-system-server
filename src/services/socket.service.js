const { Server } = require("socket.io");
const server = require("../config/socket.config");
const vars = require("../utils/vars");

let users = vars.users;
const SocketService = () => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });

  const addUser = (userId, socketId) => {
    if (userId) {
      !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    }
  };

  const getUser = async (userId) => {
    // console.log("getUser", userId);
    let user = await users.find(
      (user) => user.userId.toString() === userId.toString()
    );
    return user;
  };

  const removeUser = (userId) => {
    users = users.filter((user) => user.userId !== userId);
  };

  io.on("connection", (socket) => {
    // When Connect
    console.log("Connected to socket.io");
    socket.on("addUser", (user) => {
      console.log("A user is online", user?._id);
      addUser(user?._id);
      io.emit("getUsers", users);
    });

    socket.emit("me", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData?._id);
      socket.emit("connected");
    });

    // io.emit("getUsers", users);

    socket.on("join_chat", (room) => {
      socket.join(room);
      io.emit("getUsers", users);
      console.log("User joined room: ", room);
    });

    socket.on("sendMessage", async (data) => {
      socket.in(data.conversation_id).emit("getMessage", data);
    });

    socket.on("userOffline", (user) => {
      console.log("A user is offline: ", user?._id);
      removeUser(user?._id);
      io.emit("getUsers", users);
    });
  });
};

module.exports = SocketService;
