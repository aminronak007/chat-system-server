const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const vars = require("../utils/vars");

server.listen(vars.chat_port, () => {
  console.log(`Socket Server is running on Port ${vars.chat_port}`);
});

module.exports = server;
