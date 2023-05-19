const mongoose = rwquire("mongoose");

const MessageSchema = mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Types.ObjectId,
    },
    sender_id: {
      type: mongoose.Types.ObjectId,
    },
    text: {
      type: String,
    },
    isFriend: {
      type: Boolean,
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
