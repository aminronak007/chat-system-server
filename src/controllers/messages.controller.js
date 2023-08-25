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
      let conversation_id = req.params.id;

      let queryParams = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.limit),
      };

      let result = await MessageModel.read(conversation_id, queryParams);

      if (result?.result?.length === 0) {
        return successHandler(res, 200, message.NO_FOUND("Messages"), false);
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
      let { id, tempId, images } = req.body;
      let result = await MessageModel.delete(id, tempId, images);

      return successHandler(res, 200, message.DELETED("Message"), result);
    } catch (err) {
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new MessagesController();
