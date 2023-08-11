const { MessageModel } = require("../models/messages.model");

class MessagesController {
  async create(req, res) {
    try {
      const input = req.body;
      let result = await MessageModel.create(input);

      if (!result) {
        return errorHandler(res, 200, message.ERROR, result);
      }

      return successHandler(res, 200, message.SUCCESS("Message store"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async read(req, res) {
    try {
      const conversation_id = req.params.id;
      let result = await MessageModel.read(conversation_id);

      if (!result) {
        return errorHandler(res, 200, message.NOT_FOUND("Messages"), result);
      }
      return successHandler(res, 200, message.NO_FOUND("Messages"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async update(req, res) {
    try {
      let result = await MessageModel.update();
      return successHandler(res, 200, message.UPDATED("User id"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async delete(req, res) {
    try {
      let result = await MessageModel.delete();
      return successHandler(res, 200, message.UPDATED("User id"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new MessagesController();
