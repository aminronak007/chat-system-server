const { ConversationModel } = require("../models/conversations.model");

class ConversationsController {
  async create(req, res) {
    try {
      let input = req.body;

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
      let input = req.body;

      let result = await ConversationModel.read(input);

      if (!result) {
        return errorHandler(
          res,
          200,
          message.NOT_EXISTS("No Conversations"),
          {}
        );
      }
      return successHandler(res, 200, message.UPDATED("User id"), result);
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