const { Server } = require("socket.io");
const server = require("../config/socket.config");

// Store the mapping of user IDs to their sockets
const userSocketsMap = new Map();

const SocketService = () => {
  const io = new Server(server, {
    cors: {
      origin: `*`,
    },
  });

  const activeUsers = {}; // Store active users and their sockets

  io.on("connection", (socket) => {
    // When Connect
    console.log("A user is connected.");

    socket.on("addUser", (users) => {
      // console.log(users);
      userSocketsMap.set(users[0], socket);
      userSocketsMap.set(users[1], socket);
    });

    socket.on("privateMessage", (data) => {
      const recipientSocket = activeUsers[data.receiverId];

      if (recipientSocket) {
        recipientSocket.emit("getMessage", data);
      }
    });

    // Send and Get Message
    socket.on("sendMessage", async (data) => {
      // userSocketsMap.set(receiverId, socket);
      const targetSocket = userSocketsMap.get(data?.receiverId);

      const createdAt = Date.now();
      data.createdAt = createdAt;

      if (targetSocket) {
        targetSocket.emit("getMessage", data);
      } else {
        console.log(
          `User with ID ${data?.receiverId} not found or not connected.`
        );
      }
    });

    // When Disconnect
    socket.on("disconnect", () => {
      console.log("a user is disconnected.");
    });
  });
};

module.exports = SocketService;
