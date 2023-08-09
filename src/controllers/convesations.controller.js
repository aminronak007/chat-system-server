const { ConversationModel } = require("../models/conversations.model");
const { UserModel } = require("../models/users.model");

class ConversationsController {
  async create(req, res) {
    try {
      let user_id = req.user._id;
      let input = req.body;

      await UserModel.updateLastSelectedChat(user_id, input.receiver_id);
      let result = await ConversationModel.create(input);

      if (!result) {
        return errorHandler(res, 200, message.EXISTS("Conversation"), {});
      }
      return successHandler(res, 200, message.CREATED("Conversation"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async createChannel(req, res) {
    try {
      let input = req.body;

      let result = await ConversationModel.createChannel(input);

      if (!result) {
        return errorHandler(res, 200, message.EXISTS("Channel"), {});
      }
      return successHandler(res, 200, message.CREATED("Channel"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async read(req, res) {
    try {
      let user_id = req.user._id;

      let result = await ConversationModel.read(user_id);

      if (!result) {
        return errorHandler(res, 200, message.NOT_FOUND("Conversations"), {});
      }
      return successHandler(
        res,
        200,
        message.NO_FOUND("Conversations"),
        result
      );
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async updateChannel(req, res) {
    try {
      let input = req.body;

      let result = await ConversationModel.update(input);

      if (!result) {
        return errorHandler(res, 200, message.EXISTS("Conversation"), {});
      }
      return successHandler(res, 200, message.UPDATED("Member"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async delete(req, res) {
    try {
      let input = req.body;

      let result = await ConversationModel.delete(input);

      if (!result) {
        return errorHandler(res, 200, message.NOT_EXISTS("Conversation"), {});
      }
      return successHandler(res, 200, message.DELETED("Conversation"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new ConversationsController();
