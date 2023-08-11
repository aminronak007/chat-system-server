const { Server } = require("socket.io");
const server = require("../config/socket.config");

const SocketService = () => {
  let users = vars.users;

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  const addUser = (userId, socketId) => {
    if (userId) {
      !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    }
    // console.log("users", users);
  };

  const getUser = async (userId) => {
    // console.log("getUser", userId);
    return await users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    // When Connect
    console.log("A user is connected.");

    socket.on("addUser", (userData) => {
      // console.log("userAdd", userData);

      addUser(userData, socket.id);
      io.emit("getUsers", users);
      // console.log("userAddAfter", users);
    });

    socket.on("sendMessage", async (data) => {
      console.log("data", data);
      const user = await getUser(data.receiverId);
      console.log("user", user, users);
      if (user) {
        io.to(user.socketId).emit("getMessage", data);
      }
    });
  });
};

module.exports = SocketService;
