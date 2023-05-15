const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

let Conversations = mongoose.model("conversations", ConversationSchema);

class ConversationModel {
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

module.exports = { Conversations, ConversationModel: new ConversationModel() };
