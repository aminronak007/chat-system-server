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

  io.on("connection", (socket) => {
    // When Connect
    console.log("Connected to socket.io");
    socket.on("addUser", (userId) => {
      addUser(userId);
      io.emit("getUsers", users);
    });

    socket.emit("me", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData?._id);
      addUser(userData?._id, socket.id);
      socket.emit("connected");
    });

    io.emit("getUsers", users);

    socket.on("join_chat", (room) => {
      socket.join(room);
      console.log("User joined room: ", room);
    });

    socket.on("sendMessage", async (data) => {
      socket.in(data.conversation_id).emit("getMessage", data);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("call_end");
    });

    socket.on("call_user", (data) => {
      io.to(data.userToCall).emit("call_user", {
        signal: data.signalData,
        friom: data.from,
        name: data.name,
      });
    });

    socket.on("answer_call", (data) => {
      io.to(data.to).emit("call_accepted", data.signal);
    });
  });
};

module.exports = SocketService;
