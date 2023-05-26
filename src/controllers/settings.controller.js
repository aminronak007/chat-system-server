const { UserModel } = require("../models/users.model");

class SettingsController {
  constructor() {}

  async updateThemeSettings(req, res) {
    try {
      const id = req.user._id;
      const input = req.body;

      const result = await UserModel.updateThemeColor(id, input);

      if (!result) {
        return errorHandler(res, 200, message.SOMETHING_WENT_WRONG, {});
      }

      return successHandler(
        res,
        200,
        message.UPDATED("Theme settings"),
        result
      );
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async updatePrivacySettings(req, res) {
    try {
      const id = req.user._id;
      const input = req.body;

      const result = await UserModel.updatePrivacySettings(id, input);

      if (!result) {
        return errorHandler(res, 200, message.SOMETHING_WENT_WRONG, {});
      }

      return successHandler(
        res,
        200,
        message.UPDATED("Privacy settings"),
        result
      );
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new SettingsController();
