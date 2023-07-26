const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { signAccessToken } = require("../middlewares/jwt");
const { unlinkFiles } = require("../helpers/helpers");

const UserSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    last_conversation_id: {
      type: mongoose.Types.ObjectId,
    },
    location: {
      type: String,
    },
    themeColor: {
      type: String,
    },
    themeBackground: {
      type: String,
    },
    userStatus: {
      type: String,
      enum: ["Active", "Away", "Do not disturb"],
      default: "Active",
    },
    profilePhotoSeen: {
      type: String,
      enum: ["everyone", "nobody", "selected"],
      default: "everyone",
    },
    lastSeen: {
      type: Boolean,
      default: true,
    },
    statusSeen: {
      type: String,
      enum: ["everyone", "nobody", "selected"],
      default: "everyone",
    },
    readReceipts: {
      type: Boolean,
      default: false,
    },
    groupsSeen: {
      type: String,
      enum: ["everyone", "nobody", "selected"],
      default: "everyone",
    },
    lastSelectedChat: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

let User = mongoose.model("User", UserSchema);

let user_fields =
  "first_name last_name email mobile status profile last_conversation_id coverImage location themeColor themeBackground userStatus lastSelectedChat";
class UserModel {
  constructor() {}

  async login(input) {
    try {
      const { email, password } = input;

      const checkUserExists = await User.findOne({ email });

      if (!checkUserExists) {
        return false;
      }

      const checkPassword = await bcrypt.compare(
        password,
        checkUserExists.password
      );

      if (!checkPassword) {
        return false;
      }

      const token = await signAccessToken(checkUserExists);
      let data = false;

      if (token) {
        data = {
          token,
          isUserLogin: true,
        };
      }

      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async checkUser(id) {
    try {
      const getUserDetails = await User.findOne({ _id: id })
        .select(user_fields)
        .lean();

      return getUserDetails;
    } catch (err) {
      throw new Error(err);
    }
  }

  async createUser(input, file) {
    try {
      const { first_name, last_name, email, mobile, password } = input;
      let hashPassword = await bcrypt.hash(password, 10);

      const userExists = await User.find({ $or: [{ email }, { mobile }] });

      if (userExists.length > 0) {
        return userExists;
      }

      const result = await new User({
        first_name,
        last_name,
        email,
        mobile,
        password: hashPassword,
        profile: file.filename,
      }).save();

      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUsers(id) {
    try {
      const result = await User.find({ $ne: { _id: id } })
        .select(user_fields)
        .lean();

      if (result.length > 0) {
        return result;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserById(id) {
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

  async editUser(id, input, file) {
    try {
      const data = {
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        mobile: input.mobile,
        status: input.status,
        profile: file.filename,
      };

      const result = await User.findByIdAndUpdate({ _id: id }, data).exec();

      if (result) {
        return result;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteUser(id) {
    try {
      const result = await User.findOneAndDelete({ _id: id }).exec();

      if (result) {
        return result;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async searchUser(id, input) {
    try {
      let keyword = input.split(" ").join(""); // For removing whitespace or space

      // let regex = { $regex: `^${input}$`, $options: "i" }; // For Specific Keyword Search
      let regex = { $regex: `^${keyword}`, $options: "i" }; // For Partial Keyword Search

      const result = await User.find({
        _id: { $ne: id },
        $or: [{ first_name: regex }, { last_name: regex }, { email: regex }],
      })
        .select("first_name last_name email profile")
        .exec();

      let items = [];
      for (let i = 0; i < result.length; i++) {
        items.push({
          key: i,
          value: result[i]._id,
          text: result[i].first_name + " " + result[i].last_name,
        });
      }

      // console.log(result);
      if (items.length > 0) {
        return items;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async lastConversationId(id, user_id) {
    try {
      const result = await User.findOneAndUpdate(
        { _id: id },
        { last_conversation_id: user_id, lastSelectedChat: user_id }
      );

      if (result) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async uploadProfile(id, filename) {
    try {
      let profile = await User.findOne({ _id: id }).select("profile").lean();
      const result = await User.findOneAndUpdate({
        _id: id,
        profile: filename,
      });

      if (filename !== profile.profile) {
        await unlinkFiles(
          `${process.env.UPLOAD_DIR}/profile/${profile.profile}`
        );
      }
      if (result) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async uploadCoverImage(id, filename) {
    try {
      let coverImage = await User.findOne({ _id: id })
        .select("coverImage")
        .lean();

      const result = await User.findOneAndUpdate({
        _id: id,
        coverImage: filename,
      });

      if (filename !== coverImage.coverImage) {
        await unlinkFiles(
          `${process.env.UPLOAD_DIR}/coverImages/${coverImage.coverImage}`
        );
      }
      if (result) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateStatus(id, userStatus) {
    try {
      const result = await User.findOneAndUpdate({
        _id: id,
        userStatus,
      }).exec();

      if (result) {
        return true;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateThemeColor(id, input) {
    try {
      const { themeBackground, themeColor } = input;
      const result = await User.findOneAndUpdate({
        _id: id,
        themeColor,
        themeBackground,
      }).exec();

      if (result) {
        return true;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updatePrivacySettings(id, input) {
    try {
      const {
        profilePhotoSeen,
        lastSeen,
        statusSeen,
        readReceipts,
        groupsSeen,
      } = input;

      const result = await User.findOneAndUpdate({
        _id: id,
        profilePhotoSeen,
        lastSeen,
        statusSeen,
        readReceipts,
        groupsSeen,
      }).exec();

      if (result) {
        let settings = await User.findOne({ _id: id }).select(
          "profilePhotoSeen lastSeen statusSeen readReceipts groupsSeen"
        );
        return settings;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getPrivacySettings(id) {
    try {
      const result = await User.findOne({
        _id: id,
      })
        .select("profilePhotoSeen lastSeen statusSeen readReceipts groupsSeen")
        .lean();

      if (result) {
        return result;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async changePassword(id, input) {
    try {
      const { old_password, new_password } = input;

      const result = await User.findOne({ _id: id }).lean();

      const checkPassword = await bcrypt.compare(old_password, result.password);

      if (!checkPassword) {
        return false;
      }

      if (checkPassword) {
        let hashPassword = await bcrypt.hash(new_password, 10);
        const result = await User.findOneAndUpdate({
          _id: id,
          password: hashPassword,
        }).lean();

        if (result) {
          return true;
        }
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateUsername(id, input) {
    try {
      const { username } = input;

      const result = await User.findOneAndUpdate({ _id: id, username }).exec();

      if (result) {
        return true;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateLastSelectedChat(user_id, selectedChatId) {
    try {
      const result = await User.findOneAndUpdate(
        { _id: user_id },
        {
          lastSelectedChat: selectedChatId,
        }
      );

      if (result) {
        return true;
      }

      return false;
    } catch (err) {
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

module.exports = { User, UserModel: new UserModel() };
