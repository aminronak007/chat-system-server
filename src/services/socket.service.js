const { Server } = require("socket.io");
const server = require("../config/socket.config");
const vars = require("../utils/vars");
const MessageController = require("../controllers/messages.controller");

let users = vars.users;

const SocketService = () => {
  const io = new Server(server, {
    cors: {
      origin: `*`,
    },
  });

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
    let user = await users.find((user) => {
      return user.userId === userId;
    });
    return user;
  };

  io.on("connection", (socket) => {
    // When Connect
    console.log("A user is connected.");
    // Join a room
    socket.on("join", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Take user id and socket id from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // Send and Get Message
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      let user = "";
      if (receiverId.length > 0 && typeof receiverId !== "string") {
        for (let i = 0; i < receiverId.length; i++) {
          user = await getUser(receiverId[i]);
        }
      } else {
        user = await getUser(receiverId);
      }
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        socket_id: user.socketId,
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
