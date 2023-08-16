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
      !users.some((user) => user.userId.toString() === userId.toString()) &&
        users.push({ userId, socketId });
    }
  };

  const getUser = async (userId) => {
    // console.log("getUser", userId);
    return await users.find(
      (user) => user.userId.toString() === userId.toString()
    );
  };

  const removeUser = (userId) => {
    if (userId) {
      users = users.filter(
        (user) => user?.userId?.toString() !== userId?.toString()
      );
    }
  };

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

    // socket.on("addUser", (userData) => {
    //   // console.log("userAdd", userData);

    //   addUser(userData, socket.id);
    //   io.emit("getUsers", users);
    //   // console.log("userAddAfter", users);
    // });

    // socket.on("sendMessage", async (data) => {
    //   const user = await getUser(data.receiverId);
    //   if (user) {
    //     io.to(user?.socketId).emit("getMessage", data);
    //   }
    // });

    // // When Disconnect
    // socket.on("removeUser", async (userId) => {
    //   console.log("a user is disconnected.");
    //   await removeUser(userId);
    //   io.emit("getUsers", users);
    // });
  });
};

module.exports = SocketService;
