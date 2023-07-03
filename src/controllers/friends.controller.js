const { FriendModel } = require("../models/friends.model");

class FriendController {
  async getContacts(req, res) {
    try {
      const result = await FriendModel.getContacts(req.user._id);

      if (!result) {
        return errorHandler(res, 200, message.NO_FOUND("No contacts"), {});
      }

      return successHandler(
        res,
        200,
        message.SUCCESS("Contacts Found"),
        result
      );
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
  async create(req, res) {
    try {
      let input = req.body;
      let user_id = req.user._id;

      let result = await FriendModel.create(input, user_id);

      if (!result) {
        return errorHandler(res, 200, message.EXISTS("Contact"), {});
      }
      return successHandler(res, 200, message.CREATED("Contact"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}
module.exports = new FriendController();
