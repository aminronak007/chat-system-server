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

  io.on("connection", (socket) => {
    // When Connect
    console.log("A user is connected.");

    // Custom event to register the user with their ID
    socket.on("addUser", (receiverId) => {
      // Store the user's socket using their ID as the key
      userSocketsMap.set(receiverId, socket);
      // console.log(`User ${receiverId} is now registered.`);
    });

    // Send and Get Message
    socket.on("sendMessage", async ({ senderId, receiverId, data }) => {
      // userSocketsMap.set(receiverId, socket);
      const targetSocket = userSocketsMap.get(receiverId);

      if (targetSocket) {
        targetSocket.emit("getMessage", {
          ChatMode: "Individual",
          SenderUserId: senderId,
          RecipientUserId: receiverId,
          message: {
            MessageType: "Text",
            Text: data,
          },
          Status: "Delivered",
          Datetime: new Date(),
        });
      } else {
        console.log(`User with ID ${receiverId} not found or not connected.`);
      }
    });

    // When Disconnect
    socket.on("disconnect", () => {
      console.log("a user is disconnected.");
    });
  });
};

module.exports = SocketService;
