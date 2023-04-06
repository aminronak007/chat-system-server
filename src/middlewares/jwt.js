const jwt = require("jsonwebtoken");

module.exports = {
  signAccessToken: (user) => {
    return new Promise((resolve, reject) => {
      const payload = { user };
      const options = {
        expiresIn: "1m",
      };
      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"])
      return res.json({ message: "Access Denied" });

    const authHeader = req.headers["authorization"];
    const token = authHeader;
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return res.json({ message: err });
      if (payload) {
        const { _id, first_name, last_name, email, mobile, status } =
          payload.user;
        const user = { _id, first_name, last_name, email, mobile, status };

        req.user = user;
        next();
      }
    });
  },
};
