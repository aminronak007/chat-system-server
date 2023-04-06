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
  },
  { timestamps: true }
);

let User = mongoose.model("User", UserSchema);

class UserModel {
  constructor() {}

  async login(input) {
    try {
      const { email, password } = input;

      const checkUserExists = await User.findOne({ email });

      if (!checkUserExists) {
        return checkUserExists;
      }

      const checkPassword = await bcrypt.compare(
        password,
        checkUserExists.password
      );

      if (!checkPassword) {
        return checkPassword;
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
        .select("_id first_name last_name email mobile status")
        .lean();

      return getUserDetails;
    } catch (err) {
      throw new Error(err);
    }
  }

  async createUser(input) {
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
      }).save();

      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUsers(input) {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserById(input) {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }

  async editUser(input) {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteUser(input) {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }

  async searchUser(input, id) {
    try {
      let regex = { $regex: `^${input}$`, $options: "i" };
      const data = await User.find({
        _id: { $ne: id },
        $or: [{ first_name: regex }, { last_name: regex }, { email: regex }],
      }).select("first_name last_name email");

      if (data.length > 0) {
        return data;
      }

      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async example($input) {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = { User, UserModel: new UserModel() };
