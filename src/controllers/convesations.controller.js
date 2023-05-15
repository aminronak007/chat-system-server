const { ConversationModel } = require("../models/conversations.model");

class ConversationsController {
  async create(req, res) {
    try {
      let result = await ConversationModel.create();
      return successHandler(res, 200, message.UPDATED("User id"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async read(req, res) {
    try {
      let result = await ConversationModel.read();
      return successHandler(res, 200, message.UPDATED("User id"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async update(req, res) {
    try {
      let result = await ConversationModel.update();
      return successHandler(res, 200, message.UPDATED("User id"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async delete(req, res) {
    try {
      let result = await ConversationModel.delete();
      return successHandler(res, 200, message.UPDATED("User id"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = ConversationsController;
