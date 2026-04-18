import mongoose from "mongoose";
import {
  Transaction_Status,
  Transaction_Type_Enum,
} from "../../common/enum/transaction.enum.js";

const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Transaction_Status),
      required: true,
      default: Transaction_Status.pending,
    },

    type: {
      type: String,
      enum: Object.values(Transaction_Type_Enum),
      required: true,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
  },
);

const transactionModel =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default transactionModel;
