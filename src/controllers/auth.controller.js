const { UserModel } = require("../models/users.model");

class AuthController {
  constructor() {}

  async login(req, res) {
    try {
      req
        .checkBody("email")
        .notEmpty()
        .withMessage("Please enter email.")
        .isEmail()
        .withMessage("The email you have entered is invalid")
        .isLength({ max: 60 })
        .withMessage("Email id should not be more than 60 Characters.");
      req
        .checkBody("password")
        .notEmpty()
        .withMessage("Please provide password.");

      const errors = req.validationErrors();

      if (errors) {
        return errorHandler(res, 400, message.SOMETHING_WRONG, errors);
      }

      const result = await UserModel.login(req.body);

      res.cookie("accessToken", result, {
        // expires: new Date(Date.now() + 3600000), // 1 hour
        maxAge: 24 * 60 * 60 * 1000, //  1 Day
        // httpOnly: true,
        secure: true,
        sameSite: true,
      });

      if (!result) {
        return errorHandler(res, 400, message.CREDENTIALS_WRONG, {});
      }

      return successHandler(res, 200, message.SUCCESS("Login"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("accessToken");
      return successHandler(res, 200, message.SUCCESS("Logout"), {});
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async checkUser(req, res) {
    try {
      const { user } = req;

      return successHandler(
        res,
        200,
        message.SUCCESS("User details found"),
        user
      );
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async example(req, res) {
    try {
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new AuthController();
