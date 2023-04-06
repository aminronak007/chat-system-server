const server = require("http").createServer();
const socketConnection = () => {
  server.listen(vars.chat_port, () => {
    console.log(`Chat server listening on ${vars.chat_port}`);
  });
};

module.exports = { socketConnection, server };
