require("dotenv").config();

const vars = {
  port: process.env.PORT || 8082,
  mongo_uri: process.env.MONGO_URI,
  front_url: process.env.FRONT_URL || "http://localhost:3000",
  chat_port: process.env.CHAT_PORT || 9092,
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
};

module.exports = vars;
