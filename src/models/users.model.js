const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { signAccessToken } = require("../middlewares/jwt");

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
    last_conversation_id: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

let User = mongoose.model("User", UserSchema);

let user_fields =
  "first_name last_name email mobile status profile last_conversation_id";
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

      return token;
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

      // console.log(result);
      if (result.length > 0) {
        return result;
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
        { last_conversation_id: user_id }
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
