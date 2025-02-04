const mongoose = require("mongoose");
const fs = require("fs");
const { Friends } = require("./friends.model");
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = mongoose.Schema(
  {
    temp_id: {
      type: String,
    },
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
    images: {
      type: Array,
    },
    attachments: {
      type: Array,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

let Message = mongoose.model("messages", MessageSchema);

class MessageModel {
  async create(input) {
    try {
      let result = "";
      let { messageType, receiverId } = input;

      const checkFriendOrNot = await Friends.findOne({
        friend_id: receiverId,
      }).lean();

      if (messageType === "text") {
        result = await Message.create({
          ...input,
        });
      }

      if (messageType === "image") {
        result = await Message.create({
          ...input,
          images: input?.images?.length > 0 && JSON.parse(input.images),
        });
      }

      if (messageType === "file") {
        result = await Message.create({
          ...input,
          attachments:
            input?.attachments?.length > 0 && JSON.parse(input.attachments),
        });
      }

      if (result) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
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

      const result = await Message.find({ conversation_id, isDelete: false })
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

  async delete(id, tempId, image) {
    try {
      const result = await Message.findOneAndUpdate(
        { $or: [{ _id: id }, { temp_id: tempId }] },
        { isDelete: true }
      );

      if (result) {
        return true;
      }

      if (image) {
        fs.unlinkSync(`../../${process.env.UPLOAD_DIR}/media/images/${image}`);
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getMediaByChatUserId(id) {
    try {
      const result = await User.findOne({ _id: id }).select(user_fields).lean();

      if (result) {
        return result;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = { Message, MessageModel: new MessageModel() };
