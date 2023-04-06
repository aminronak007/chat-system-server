const { UserModel } = require("../models/users.model");

class UserController {
  constructor() {}

  async searchUser(req, res) {
    try {
      const result = await UserModel.searchUser(
        req.params.search,
        req.user._id
      );
      if (!result) {
        return errorHandler(res, 200, message.NO_FOUND("No users"), {});
      }

      return successHandler(res, 200, message.SUCCESS("Users Found"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new UserController();
