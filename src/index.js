const express = require("express");
const cors = require("cors");
const vars = require("./utils/vars");
const globalVariablesFunction = require("./utils/global_vars_and_funcs");
const dbConnection = require("./config/mongodb.config");
const { socketConnection } = require("./config/socket.config");
const expressValidator = require("express-validator");

globalVariablesFunction();
dbConnection();
socketConnection();

const app = express();
const PORT = vars.port;

app.use(expressValidator());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use("/uploads", express.static(__dirname.replace("/src", "") + "/uploads"));

// ------- Front Routes -------
const AuthRoutes = require("./routes/auth.routes");
const UserRoutes = require("./routes/user.routes");

// ------- Front Routes -------
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);

// ------- Admin Routes -------
const UserAdminRoutes = require("./routes/admin/users.routes");

app.use("/api/v1/admin/users", UserAdminRoutes);
// ------- Admin Routes -------

app.use("/", express.static(__dirname.replace("/src", "") + "/Public"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname.replace("/src", ""), "Public/index.html"));
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
