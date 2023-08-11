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

  async read(conversation_id) {
    try {
      const result = await Message.find({ conversation_id }).lean();

      if (result.length > 0) {
        return result;
      }
      return false;
    } catch (err) {
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
