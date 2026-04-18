import * as db_service from "../../DB/db.service.js";
import bankAccountModel from "../../DB/models/bankAccount.model.js";
import transactionModel from "../../DB/models/transaction.model.js";
import userModel from "../../DB/models/user.model.js";
import {
  Transaction_Status,
  Transaction_Type_Enum,
} from "../../common/enum/transaction.enum.js";
import { successResponse } from "../../common/utils/response.success.js";

export const deposit = async (req, res, next) => {
  const { accountId, amount } = req.body;
  const userId = req.user._id;
  let balanceBefore;
  let balanceAfter;

  const ExistsAccount = await db_service.findById({
    model: bankAccountModel,
    id: accountId,
  });
  if (!ExistsAccount) {
    throw new Error("Account not found", { cause: 404 });
  }

  if (ExistsAccount.userId.toString() !== userId.toString()) {
    throw new Error("You are not authorized to perform this transaction", {
      cause: 403,
    });
  }

  balanceBefore = ExistsAccount.balance;
  balanceAfter = ExistsAccount.balance + amount;

  const transaction = await db_service.create({
    model: transactionModel,
    data: {
      accountId: ExistsAccount._id,
      amount,
      balanceBefore,
      balanceAfter,
      type: Transaction_Type_Enum.deposit,
      status: Transaction_Status.completed,
    },
  });

  await db_service.updateOne({
    model: bankAccountModel,
    filter: { _id: ExistsAccount._id },
    update: {
      balance: balanceAfter,
    },
  });

  return successResponse({
    res,
    status: 201,
    message: "Deposit successful",
    data: transaction,
  });
};

export const withdraw = async (req, res, next) => {
  const { accountId, amount } = req.body;
  const userId = req.user._id;
  let balanceBefore;
  let balanceAfter;

  const ExistsAccount = await db_service.findById({
    model: bankAccountModel,
    id: accountId,
  });
  if (!ExistsAccount) {
    throw new Error("Account not found", { cause: 404 });
  }
  if (ExistsAccount.userId.toString() !== userId.toString()) {
    throw new Error("You are not authorized to perform this transaction", {
      cause: 403,
    });
  }
  if (ExistsAccount.balance < amount) {
    throw new Error("The cash is insufficient", {
      cause: 400,
    });
  }

  balanceBefore = ExistsAccount.balance;
  balanceAfter = ExistsAccount.balance - amount;

  const transaction = await db_service.create({
    model: transactionModel,
    data: {
      accountId: ExistsAccount._id,
      amount,
      balanceBefore,
      balanceAfter,
      type: Transaction_Type_Enum.withdraw,
      status: Transaction_Status.completed,
    },
  });

  await db_service.updateOne({
    model: bankAccountModel,
    filter: { _id: ExistsAccount._id },
    update: {
      balance: balanceAfter,
    },
  });

  return successResponse({
    res,
    status: 201,
    message: "Withdraw successful",
    data: transaction,
  });
};

export const transfer = async (req, res, next) => {
  const { accountId, accountId_To, transfer_amount } = req.body;
  const userId = req.user._id;

  if (accountId === accountId_To) {
    throw new Error("Cannot transfer to the same account", { cause: 400 });
  }
  const senderAccount = await db_service.findOne({
    model: bankAccountModel,
    filter: { _id: accountId },
  });
  if (!senderAccount) {
    throw new Error("The sender account is not found", { cause: 404 });
  }
  const recipientAccount = await db_service.findOne({
    model: bankAccountModel,
    filter: { _id: accountId_To },
  });
  if (!recipientAccount) {
    throw new Error("The recipient account is not found", { cause: 404 });
  }

  if (senderAccount.userId.toString() !== userId.toString()) {
    throw new Error("You are not authorized to perform this transaction", {
      cause: 403,
    });
  }
  if (senderAccount.balance < transfer_amount) {
    throw new Error("The cash is insufficient", {
      cause: 400,
    });
  }

  const sender_balanceBefore = senderAccount.balance;
  const sender_balanceAfter = senderAccount.balance - transfer_amount;
  const recipient_balanceBefore = recipientAccount.balance;
  const recipient_balanceAfter = recipientAccount.balance + transfer_amount;

  const sender_transaction = await db_service.create({
    model: transactionModel,
    data: {
      accountId: senderAccount._id,
      amount: transfer_amount,
      balanceBefore: sender_balanceBefore,
      balanceAfter: sender_balanceAfter,
      type: Transaction_Type_Enum.transfer,
      status: Transaction_Status.completed,
    },
  });
  const recipient_transaction = await db_service.create({
    model: transactionModel,
    data: {
      accountId: recipientAccount._id,
      amount: transfer_amount,
      balanceBefore: recipient_balanceBefore,
      balanceAfter: recipient_balanceAfter,
      type: Transaction_Type_Enum.transfer,
      status: Transaction_Status.completed,
    },
  });

  await db_service.updateOne({
    model: bankAccountModel,
    filter: { _id: senderAccount._id },
    update: {
      balance: sender_balanceAfter,
    },
  });

  await db_service.updateOne({
    model: bankAccountModel,
    filter: { _id: recipientAccount._id },
    update: {
      balance: recipient_balanceAfter,
    },
  });

  return successResponse({
    res,
    status: 201,
    message: "Transfer successful",
    data: {
      sender_transaction,
      recipient_transaction,
    },
  });
};

export const myTransaction = async (req, res, next) => {
  const transactionID = req.params.id;
  const userId = req.user._id;

  const transaction = await db_service.findById({
    model: transactionModel,
    id: transactionID,
  });
  if (!transaction) {
    throw new Error("Transaction not found", { cause: 404 });
  }

  return successResponse({
    res,
    status: 201,
    message: "Transaction fetched successfully",
    data: transaction,
  });
};

export const MyAllTransactions = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const transactions = await db_service.find({
    model: transactionModel,
    filter: { userId },
    options: {
      skip,
      limit: limitNum,
      populate: [{ path: "accountId", select: "accountNumber" }],
    },
  });

  return successResponse({
    res,
    status: 201,
    message: "Transactions fetched successfully",
    data: transactions,
  });
};
