const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema(
  {
    participants: {
      type: Array,
    },
    isChannel: {
      type: Boolean,
    },
    name: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    last_message_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

let Conversations = mongoose.model("conversations", ConversationSchema);

class ConversationModel {
  async create(input) {
    try {
      const { senderId, receiverId } = input;

      const conversation = await Conversations.findOne({
        participants: { $all: [senderId, receiverId] },
        isChannel: { $ne: true },
      }).lean();

      console.log("conversation", conversation);

      if (!conversation) {
        const newConversation = await Conversations.create({
          participants: [senderId, receiverId],
          isChannel: false,
        });

        if (newConversation) {
          return true;
        }
      }
      return false;
    } catch (err) {
      // Handle the error
      console.log(err);
      throw new Error(err);
    }
  }

  async createChannel(input) {
    try {
      const { members, name } = input;

      const conversation = await Conversations.findOne({
        participants: { $all: members },
      }).lean();

      if (!conversation) {
        const newConversation = await Conversations.create({
          name: name,
          participants: members,
          isChannel: true,
        });

        if (newConversation) {
          return true;
        }
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async read(input) {
    try {
      const { user_id } = input;
      const conversations = await Conversations.find({
        participants: {
          $in: [user_id],
        },
      }).lean();

      if (conversations.length > 0) {
        return conversations;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateChannel(input) {
    try {
      const { conversation_id, member_id } = input;

      const conversation = await Conversations.findOne({
        _id: conversation_id,
        participants: { $all: [member_id] },
      }).lean();

      if (!conversation) {
        const addMember = await Conversations.update(
          { _id: conversation_id },
          {
            $push: {
              participants: member_id,
            },
          }
        );
        console.log("addMember", addMember);

        if (addMember) {
          return true;
        }
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(input) {
    try {
      const { conversation_id } = input;

      const deleteConversation = await Conversations.deleteOne({
        _id: conversation_id,
      });

      if (deleteConversation) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = { Conversations, ConversationModel: new ConversationModel() };
