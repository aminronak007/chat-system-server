const { UserModel } = require("../models/users.model");

class UserController {
  constructor() {}

  async getUsers(req, res) {
    try {
      const result = await UserModel.getUsers(req.user._id);

      if (!result) {
        return errorHandler(res, 200, message.NO_FOUND("No users"), {});
      }

      return successHandler(res, 200, message.SUCCESS("Users Found"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async getUserById(req, res) {
    try {
      const result = await UserModel.getUserById(req.user._id);

      if (!result) {
        return errorHandler(res, 200, message.NOT_FOUND("User"), {});
      }

      return successHandler(res, 200, message.SUCCESS("User Found"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async editUser(req, res) {
    try {
      const input = req.body.user_details;

      const result = await UserModel.editUser(req.params.id, input);

      if (!result) {
        return errorHandler(res, 200, message.NOT_FOUND("User"), {});
      }

      return successHandler(res, 200, message.UPDATED("User details"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await UserModel.deleteUser(req.params.id);

      if (!result) {
        return errorHandler(res, 200, message.NOT_FOUND("User"), {});
      }

      return successHandler(res, 200, message.DELETED("User"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

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
