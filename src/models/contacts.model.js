const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ContactSchema = mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "User",
    },
    contacts: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

let Contacts = mongoose.model("Contacts", ContactSchema);

class ContactModel {
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

module.exports = { Contacts, ContactModel: new ContactModel() };
