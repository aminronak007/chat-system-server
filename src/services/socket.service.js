const { Server } = require("socket.io");
const { server } = require("../config/socket.config");
const chat_server = require("socket.io")(server);

const SocketService = () => {
  const io = new Server(chat_server, {
    cors: {
      origin: `${process.env.FRONT_URL}`,
    },
  });

  let users = [];

  const addUser = (userId, socketId) => {
    if (userId) {
      !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    }
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = async (userId) => {
    return await users.find((user) => {
      user.userId === userId;
    });
  };

  io.on("connection", (socket) => {
    // When Connect
    console.log("A user is connected.");
    // Take user id and socket id from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // Send and Get Message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });

    // When Disconnect
    socket.on("disconnect", () => {
      console.log("a user is disconnected.");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

module.exports = SocketService;
