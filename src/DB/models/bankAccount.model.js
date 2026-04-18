import mongoose, { Types } from "mongoose";

const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    status: Boolean, //true is active >> false is inactive
    currency: {
      type: String,
      default: "EGP",
    },
  },

  {
    timestamps: true,
    strictQuery: true,
  },
);

const bankAccountModel =
  mongoose.models.BankAccount ||
  mongoose.model("BankAccount", bankAccountSchema);

export default bankAccountModel;
