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

      const addFriend = await Friends.create({
        user_id,
        friend_id,
        status,
      });

      if (addFriend) {
        let senderId = user_id;
        let receiverId = friend_id;

        let data = {
          senderId,
          receiverId,
        };

        await ConversationModel.create(data);
        return true;
      }

      return false;
    } catch (err) {
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

      if (result.length > 0) {
        return result;
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async example(input) {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = { Friends, FriendModel: new FriendModel() };
