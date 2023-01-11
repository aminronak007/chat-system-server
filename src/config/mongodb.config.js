const mongoose = require("mongoose");

const dbConnection = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(vars.mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log("Connected to MongoDB.");
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

module.exports = dbConnection;
