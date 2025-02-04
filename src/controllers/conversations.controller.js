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
      let user_id = req.user._id;

      let result = await ConversationModel.createChannel(input, user_id);

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
      let id = req.params.id;
      let user_id = req.user._id;

      let result = await ConversationModel.delete(id, user_id);

      if (!result) {
        return errorHandler(res, 200, message.NOT_EXISTS("Conversation"), {});
      }
      return successHandler(res, 200, message.DELETED("Conversation"), result);
    } catch (err) {
      console.log(err);
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async getConversationByContactId(req, res) {
    try {
      let contact_id = req.params.contact_id;
      let user_id = req.user._id;

      let result = await ConversationModel.getConversationByContactId(
        contact_id,
        user_id
      );

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

  async getChannels(req, res) {
    try {
      let user_id = req.user._id;

      let result = await ConversationModel.getChannels(user_id);

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

  async archiveConversation(req, res) {
    try {
      let conversation_id = req.params.id;
      let result = await ConversationModel.archiveConversation(conversation_id);

      if (!result) {
        return errorHandler(res, 200, message.SOMETHING_WENT_WRONG, {});
      }

      let messageData = "Conversation unarchive";
      if (result.isArchive) {
        messageData = "Conversation archive";
      }
      return successHandler(res, 200, message.SUCCESS(messageData), result);
    } catch (err) {
      console.log(err);
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async getArchiveConversation(req, res) {
    try {
      let user_id = req.user._id;
      let result = await ConversationModel.getArchiveConversation(user_id);

      if (!result) {
        return errorHandler(
          res,
          200,
          message.NOT_FOUND("Archive conversations"),
          {}
        );
      }
      return successHandler(
        res,
        200,
        message.NO_FOUND("Archive conversations"),
        result
      );
    } catch (err) {
      console.log(err);
      errorHandler(res, 500, message.ERROR, []);
    }
  }

  async getCommonGroupsByCid(req, res) {
    try {
      let user_id = req.user._id;
      let result = await ConversationModel.getCommonGroupsByCid(user_id);

      if (!result) {
        return errorHandler(res, 200, message.NOT_FOUND("Common groups"), {});
      }
      return successHandler(
        res,
        200,
        message.NO_FOUND("Common groups"),
        result
      );
    } catch (err) {
      console.log(err);
      errorHandler(res, 500, message.ERROR, []);
    }
  }
}

module.exports = new ConversationsController();
