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
    deleteParticipants: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    isArchive: {
      type: Boolean,
      default: false,
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
        isChannel: { $eq: false },
      }).lean();

      if (!conversation) {
        const newConversation = await Conversations.create({
          participants: [senderId, receiverId],
          isChannel: false,
        });

        if (newConversation) {
          return this.getConversationData(newConversation, senderId);
        }
      } else {
        const newConversation = await Conversations.findOneAndUpdate(
          { _id: conversation?._id },
          { $pull: { deleteParticipants: senderId } }
        );

        if (newConversation) {
          return this.getConversationData(newConversation, senderId);
        }
      }
      return false;
    } catch (err) {
      // Handle the error
      console.log(err);
      throw new Error(err);
    }
  }

  async getConversationData(newConversation, senderId) {
    try {
      const conversationsData = await Conversations.findOne({
        _id: newConversation?._id,
        isChannel: { $eq: false },
      })
        .populate({
          path: "participants",
          match: { _id: { $ne: senderId } },
          select: "_id first_name last_name email phone userStatus profile",
        })
        .lean();

      return conversationsData;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async createChannel(input, user_id) {
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
          const conversationsData = await Conversations.findOne({
            _id: newConversation?._id,
            isChannel: { $eq: true },
          })
            .populate({
              path: "participants",
              match: { _id: { $ne: user_id } },
              select: "_id first_name last_name email phone userStatus profile",
            })
            .lean();

          return conversationsData;
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
        deleteParticipants: { $nin: user_id },
        isArchive: { $eq: false },
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

  async delete(conversation_id, user_id) {
    try {
      const updateConversation = await Conversations.findOneAndUpdate(
        {
          _id: conversation_id,
        },
        { $push: { deleteParticipants: user_id } }
      );

      const findConversation = await Conversations.findOne({
        _id: conversation_id,
      });

      if (updateConversation) {
        if (
          updateConversation.participants.length ===
          findConversation.deleteParticipants.length
        ) {
          const deleteConversation = await Conversations.findOneAndDelete({
            _id: conversation_id,
          });
          if (deleteConversation) {
            const deleteMessages = await Message.findOneAndDelete({
              conversation_id,
            });

            if (deleteMessages) {
              return true;
            }
          }
        }
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async getConversationByContactId(contact_id, user_id) {
    try {
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
        deleteParticipants: { $nin: user_id },
        isArchive: { $eq: false },
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

  async archiveConversation(conversation_id) {
    try {
      const checkConversationExist = await Conversations.findOne({
        _id: conversation_id,
      }).lean();

      if (checkConversationExist) {
        const archiveConversation = await Conversations.findOneAndUpdate(
          { _id: conversation_id },
          { isArchive: !checkConversationExist.isArchive }
        );

        if (archiveConversation) {
          let data = {
            isArchive: !checkConversationExist.isArchive,
          };
          return data;
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async getArchiveConversation(user_id) {
    try {
      const archiveConversations = await Conversations.find({
        participants: { $in: user_id },
        isArchive: true,
        deleteParticipants: { $nin: user_id },
      })
        .populate({
          path: "participants",
          match: { _id: { $ne: user_id } },
          select: "_id first_name last_name email phone userStatus profile",
        })
        .lean();

      if (archiveConversations) {
        return archiveConversations;
      }

      return false;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}

module.exports = { Conversations, ConversationModel: new ConversationModel() };
