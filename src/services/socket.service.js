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

  io.on("connection", (socket) => {
    // When Connect
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
      socket.join(userData?._id);
      socket.emit("connected");
    });

    socket.on("join_chat", (room) => {
      socket.join(room);
      console.log("User joined room: ", room);
    });

    socket.on("sendMessage", async (data) => {
      console.log("data", data);
      socket.in(data.conversation_id).emit("getMessage", data);
    });
  });
};

module.exports = SocketService;
