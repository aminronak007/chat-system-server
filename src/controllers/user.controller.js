const { UserModel } = require("../models/users.model");

class UserController {
  constructor() {}

  async searchUser(req, res) {
    try {
      const result = await UserModel.searchUser(req.params.search);

      if (!result) {
        return errorHandler(res, 400, message.NO_FOUND("No users"), {});
      }

      return successHandler(res, 200, message.SUCCESS("Users Found"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new UserController();
