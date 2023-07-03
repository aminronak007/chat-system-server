const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = mongoose.Schema(
  {
    conversation_id: {
      type: ObjectId,
      ref: "conversations",
    },
    sender_id: {
      type: ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

let Message = mongoose.model("messages", MessageSchema);

class MessageModel {
  async create() {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }

  async read() {
    try {
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
