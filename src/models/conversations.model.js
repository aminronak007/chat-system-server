const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const { Message } = require("./messages.model");

const ConversationSchema = mongoose.Schema(
  {
    participants: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
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
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

let Conversations = mongoose.model("conversations", ConversationSchema);

class ConversationModel {
  async create(input, flag) {
    try {
      const { senderId, receiverId } = input;

      const conversation = await Conversations.findOne({
        participants: { $all: [senderId, receiverId] },

        isChannel: { $eq: false },
      }).lean();

      if (!conversation) {
        const newConversation = await Conversations.create({
          participants: [senderId, receiverId],
          isChannel: false,
        });

        if (newConversation) {
          if (flag) {
            return newConversation._id;
          }
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
      const { members, name, description } = input;

      const conversation = await Conversations.findOne({
        name,
      }).lean();

      if (!conversation) {
        const newConversation = await Conversations.create({
          name,
          participants: members,
          isChannel: true,
          description,
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

  async read(user_id) {
    try {
      const conversations = await Conversations.find({
        participants: { $in: user_id },
        isChannel: { $eq: false },
      })
        .populate({
          path: "participants",
          match: { _id: { $ne: user_id } },
          select: "_id first_name last_name email phone userStatus profile",
        })
        .lean();

      if (conversations.length > 0) {
        return conversations;
      }

      return false;
    } catch (err) {
      console.log(err);
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

  async delete(conversation_id) {
    try {
      const deleteConversation = await Conversations.deleteOne({
        _id: conversation_id,
      });

      if (deleteConversation) {
        const deleteMessages = await Message.findOneAndDelete({
          conversation_id,
        });

        if (deleteMessages) {
          return true;
        }
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getConversationByContactId(contact_id, user_id) {
    try {
      console.log(contact_id, user_id);
      const conversations = await Conversations.find({
        participants: {
          $all: [contact_id, user_id],
        },
        isChannel: { $eq: false },
      })
        .populate({
          path: "participants",
          match: { _id: { $eq: contact_id } },
          select: "_id first_name last_name email phone userStatus profile",
        })
        .lean();

      if (conversations?.length > 0) {
        return conversations;
      }

      return false;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async getChannels(user_id) {
    try {
      const conversations = await Conversations.find({
        participants: { $in: user_id },
        isChannel: { $eq: true },
      })
        .populate({
          path: "participants",
          match: { _id: { $ne: user_id } },
          select: "_id first_name last_name email phone userStatus profile",
        })
        .lean();

      if (conversations.length > 0) {
        return conversations;
      }

      return false;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}

module.exports = { Conversations, ConversationModel: new ConversationModel() };
