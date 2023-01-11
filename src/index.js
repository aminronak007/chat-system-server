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
app.use(express.json());
app.use(cors({ credentials: true, origin: vars.front_url }));

// ------- Front Routes -------
const AuthRoutes = require("./routes/auth.routes");

app.use("/api/v1/auth", AuthRoutes);
// ------- Front Routes -------

// ------- Admin Routes -------
const UserAdminRoutes = require("./routes/admin/users.routes");

app.use("/api/v1/admin/users", UserAdminRoutes);
// ------- Admin Routes -------

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
