const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = mongoose.Schema(
  {
    conversation_id: {
      type: ObjectId,
      ref: "conversations",
      required: true,
    },
    senderId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    messageType: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
    },
    received: {
      type: Boolean,
    },
    sent: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

let Message = mongoose.model("messages", MessageSchema);

class MessageModel {
  async create(input) {
    try {
      const result = await Message.create(input);

      if (result) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async read(conversation_id, queryParams) {
    try {
      let page = queryParams?.page ? parseInt(queryParams?.page) : 1;
      let limit = queryParams?.limit ? parseInt(queryParams?.limit) : 10;

      const totalCount = await Message.countDocuments({ conversation_id });
      const totalPages = Math.ceil(totalCount / limit);

      // Calculate the number of items to skip
      const itemsToSkip = (page - 1) * limit;

      const result = await Message.find({ conversation_id })
        .sort({ _id: -1 })
        .skip(itemsToSkip)
        .limit(limit)
        .lean();

      let data = {
        result,
        totalPages,
        currentPage: page,
        limit,
        totalCount,
      };

      return data;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async update() {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete() {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = { Message, MessageModel: new MessageModel() };
