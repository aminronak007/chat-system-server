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
      const result = await UserModel.getUserById(req.params.id);

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
      const input = req.body;

      const result = await UserModel.editUser(req.params.id, input, req.file);

      if (!result) {
        return errorHandler(res, 200, message.NOT_FOUND("User"), {});
      }

      return successHandler(res, 200, message.UPDATED("User details"), {});
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
        req.user._id,
        req.params.keyword
      );

      if (!result) {
        return errorHandler(res, 200, message.NO_FOUND("No users"), {});
      }

      return successHandler(res, 200, message.SUCCESS("Users Found"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async lastConversationId(req, res) {
    try {
      const { user_id } = req.body;
      const id = req.user._id;
      const result = await UserModel.lastConversationId(id, user_id);

      if (!result) {
        return errorHandler(res, 200, message.NO_FOUND("No users"), {});
      }

      return successHandler(res, 200, message.UPDATED("User id"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async uploadProfile(req, res) {
    try {
      const id = req.user._id;
      let filename = req.file ? req.file?.filename : "";

      if (req.file) {
        if (req.file === undefined) {
          return ResponseHandler.errorResponse(
            res,
            400,
            message.LOGO_MSG,
            errors
          );
        }
      }
      const result = await UserModel.uploadProfile(id, filename);

      if (!result) {
        return errorHandler(res, 200, message.SOMETHING_WENT_WRONG, {});
      }

      return successHandler(
        res,
        200,
        message.UPDATED("Profile picture"),
        result
      );
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async uploadCoverImage(req, res) {
    try {
      const id = req.user._id;
      let filename = req.file ? req.file?.filename : "";

      if (req.file) {
        if (req.file === undefined) {
          return ResponseHandler.errorResponse(
            res,
            400,
            message.LOGO_MSG,
            errors
          );
        }
      }
      const result = await UserModel.uploadCoverImage(id, filename);

      if (!result) {
        return errorHandler(res, 200, message.SOMETHING_WENT_WRONG, {});
      }

      return successHandler(res, 200, message.UPDATED("Cover image"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async updateStatus(req, res) {
    try {
      const id = req?.user?._id;
      const { status } = req.body;

      const result = await UserModel.updateStatus(id, status);

      if (!result) {
        return errorHandler(res, 200, message.SOMETHING_WENT_WRONG, {});
      }

      return successHandler(res, 200, message.UPDATED("Status"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async updateUsername(req, res) {
    try {
      const id = req.user._id;
      const { username } = req.body;

      const result = await UserModel.updateUsername(id, username);

      if (!result) {
        return errorHandler(res, 200, message.SOMETHING_WENT_WRONG, {});
      }

      return successHandler(res, 200, message.UPDATED("Username"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new UserController();
