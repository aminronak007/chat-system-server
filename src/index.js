const express = require("express");
const cors = require("cors");
const vars = require("./utils/vars");
const globalVariablesFunction = require("./utils/global_vars_and_funcs");
const dbConnection = require("./config/mongodb.config");
const expressValidator = require("express-validator");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const { logs } = require("./utils/vars");
const fs = require("fs");
const path = require("path");
const SocketService = require("./services/socket.service");

globalVariablesFunction();
dbConnection();

const app = express();
const PORT = vars.port;

app.use(expressValidator());
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(mongoSanitize());
app.use(express.static("uploads"));

if (!fs.existsSync(`${__dirname}/logs`)) {
  fs.mkdirSync(`${__dirname}/logs`);
}
let accessLogStream = fs.createWriteStream(
  __dirname + "/logs/" + "access.log",
  { flags: "a" }
);

app.use(morgan(logs, { stream: accessLogStream }));

// ------- Front Routes -------
const AuthRoutes = require("./routes/auth.routes");
const UserRoutes = require("./routes/user.routes");
const SettingsRoutes = require("./routes/settings.routes");

const ConversationRoutes = require("./routes/conversations.routes");
const FriendsRouter = require("./routes/friends.routes");
const MessagesRouter = require("./routes/messages.routes");

app.get("/", (req, res) => {
  res.send("Welcone CSB Backebnd with Node.js, Socket and Docker.");
});

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

// app.use("/", express.static(__dirname.replace("/src", "") + "/public"));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname.replace("/src", ""), "public/index.html"));
// });

SocketService();
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
