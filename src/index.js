const express = require("express");
const cors = require("cors");
const vars = require("./utils/vars");
const globalVariablesFunction = require("./utils/global_vars_and_funcs");
const dbConnection = require("./config/mongodb.config");
const expressValidator = require("express-validator");
const mongoSanitize = require("express-mongo-sanitize");
// const morgan = require("morgan");
// const { logs } = require("./utils/vars");
// const fs = require("fs");
const server = require("./config/socket.config");
const path = require("path");
const { Server } = require("socket.io");

globalVariablesFunction();
dbConnection();

const app = express();
const PORT = vars.port;

app.use(expressValidator());
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.48.1:3000",
    "https://ar-chat-app.netlify.app",
    "https://ar-chat-app.onrender.com",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(express.static("uploads"));

// let accessLogStream = fs.createWriteStream(
//   __dirname + "/logs/" + "access.log",
//   { flags: "a" }
// );

// app.use(morgan(logs, { stream: accessLogStream }));

// ------- Front Routes -------
const AuthRoutes = require("./routes/auth.routes");
const UserRoutes = require("./routes/user.routes");
const SettingsRoutes = require("./routes/settings.routes");

const ConversationRoutes = require("./routes/conversations.routes");
const FriendsRouter = require("./routes/friends.routes");
const MessagesRouter = require("./routes/messages.routes");

// ------- Front Routes -------
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/user/settings", SettingsRoutes);
app.use("/api/v1/conversations", ConversationRoutes);
app.use("/api/v1/friends", FriendsRouter);
app.use("/api/v1/messages", MessagesRouter);

// ------- Admin Routes -------
const UserAdminRoutes = require("./routes/admin/users.routes");

app.use("/api/v1/admin/users", UserAdminRoutes);
// ------- Admin Routes -------

app.use("/", express.static(__dirname.replace("/src", "") + "/public"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname.replace("/src", ""), "public/index.html"));
});

let users = vars.users;

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.48.1:3000",
      "https://ar-chat-app.netlify.app",
      "https://ar-chat-app.onrender.com",
    ],
  },
  transports: ["websocket"],
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

// io.on("connection", (socket) => {
//   // When Connect
//   console.log("A user is connected.");

//   socket.on("addUser", (userData) => {
//     // console.log("userAdd", userData);

//     addUser(userData, socket.id);
//     io.emit("getUsers", users);
//     // console.log("userAddAfter", users);
//   });

//   socket.on("sendMessage", async (data) => {
//     console.log("data", data);
//     const user = await getUser(data.receiverId);
//     console.log("users", users);

//     if (user) {
//       console.log("user", user);

//       io.to(user.socketId).emit("getMessage", data);
//     }
//   });
// });

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for incoming messages
  socket.on("sendMessage", (data) => {
    console.log("Received message:", data);

    // Broadcast the message to all connected clients
    io.emit("getMessage", data);
  });

  // socket.on("disconnect", () => {
  //   console.log("A user disconnected");
  // });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
