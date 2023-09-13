const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const { ConversationModel } = require("./conversations.model");

const FriendsSchema = mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "User",
    },
    friend_id: {
      type: ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

let Friends = mongoose.model("Friends", FriendsSchema);

class FriendModel {
  constructor() {}

  async create(input, user_id) {
    try {
      const { friend_id, status } = input;

      const findFriend = await Friends.findOne({ user_id, friend_id });

      if (!findFriend) {
        const addFriend = await Friends.create({
          user_id,
          friend_id,
          status,
        });

        if (addFriend) {
          return addConversation();
        }
      } else {
        return addConversation();
      }

      async function addConversation() {
        let senderId = user_id;
        let receiverId = friend_id;

        let data = {
          senderId,
          receiverId,
        };

        let newConversationId = await ConversationModel.create(data, true);
        if (newConversationId) {
          return newConversationId;
        }
      }

      return false;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async getContacts(id) {
    try {
      const result = await Friends.find({ user_id: id })
        .populate({
          path: "friend_id",
          select: "first_name last_name profile status",
        })
        .lean();

      const groupedData = await this.groupDataByAlphabet(result);

      if (groupedData.length > 0) {
        return groupedData;
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  // Function to group data by initial alphabet
  async groupDataByAlphabet(data) {
    const grouped = {};

    data.forEach((item) => {
      const initialAlphabet = item.friend_id.first_name.charAt(0).toUpperCase();
      if (!grouped[initialAlphabet]) {
        grouped[initialAlphabet] = [];
      }
      grouped[initialAlphabet].push(item);
    });

    const result = [];
    for (const letter in grouped) {
      result.push({ letter, data: grouped[letter] });
    }

    return result;
  }

  async example(input) {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = { Friends, FriendModel: new FriendModel() };
