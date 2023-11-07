const mongoose = require("mongoose");

const dbConnection = async () => {
  return await new Promise((resolve, reject) => {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(process.env.MONGO_URI, {
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
