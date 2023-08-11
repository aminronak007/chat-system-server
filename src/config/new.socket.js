const { Server } = require("socket.io");
const vars = require("../utils/vars");

const SocketService = () => {
  const io = new Server(vars.chat_port, {
    cors: {
      origin: "*",
    },
  });

  const addUser = (userData, socketId) => {
    !users.some(
      (user) =>
        user.senderId == userData && users.push({ ...userData, socketId })
    );
  };

  io.on("connection", (socket) => {
    // When Connect
    console.log("A user is connected.");

    socket.on("addUser", (userData) => {
      console.log("userData", userData, users);
      addUser(userData, socket.id);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", (data) => {
      const user = getUser(data);
    });
  });
};

module.exports = SocketService;
